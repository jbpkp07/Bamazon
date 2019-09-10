"use strict";
/* global require, module, process */

const terminal = require("terminal-kit").terminal;
const details = require('../../mysql_connection_details.js');
const MySQLDatabase = require('./MySQLDatabase.js');


class BamazonDatabaseAPI {

    constructor() {

        this.bamazonDB = new MySQLDatabase(details.host, details.port, details.multipleStatments, details.database, details.sqlSeedPath);

        this.connected_Event = "bamazonDBConnected";
        this.disconnected_Event = "bamazonDBDisconnected";
        this.getAllProducts_Event = "bamazonGotAllProducts";
        this.getProductById_Event = "bamazonGotProductById";
        this.updateProductStock_Event = "bamazonUpdatedProductStock";
        this.failedToUpdateProductStock_Event = "bamazonFailedToUpdateProductStock";
        this.exitOnError_Event = "bamazonExitOnError";
    }

    connect() {

        this.bamazonDB.connect().then(() => {

            process.emit(this.connected_Event);

        }).catch(() => { /* Error handing done in MySQLDatabase class */ });
    }

    disconnect() {

        this.bamazonDB.disconnect().then(() => {

            process.emit(this.disconnected_Event);

        }).catch(() => { /* Error handing done in MySQLDatabase class */ });
    }

    getAllProducts() {

        const promise = this.bamazonDB.queryDatabase('SELECT * FROM products');

        promise.then(([rows, fields]) => {

            for (const row of rows) {

                row.price = parseFloat(row.price);  //convert from DECIMAL(9,2), which is read as a string, to javascript float
            }

            process.emit(this.getAllProducts_Event, [rows, fields]);

        }).catch((error) => {

            terminal.red(`   Error with BamazonDatabaseAPI function [`).white(`getAllProducts()`).red(`] ${error}\n\n`);

            process.emit(this.exitOnError_Event);
        });
    }

    getProductById(id) {

        const promise = this.bamazonDB.queryDatabase('SELECT * FROM products WHERE id = ?', [id]);

        promise.then(([rows, fields]) => {

            for (const row of rows) {

                row.price = parseFloat(row.price);  //convert from DECIMAL(9,2), which is read as a string, to javascript float
            }

            process.emit(this.getProductById_Event, [rows, fields]);

        }).catch((error) => {

            terminal.red(`   Error with BamazonDatabaseAPI function [`).white(`getProductById()`).red(`] ${error}\n\n`);

            process.emit(this.exitOnError_Event);
        });
    }

    updateProductStock(id, units, isAddingStock) {

        process.once(this.getProductById_Event, ([rows, fields]) => {

            let currentStock = rows[0].stock;
            let newStock;

            if (isAddingStock) {

                newStock = currentStock + units;
            }
            else {

                if ((currentStock - units) >= 0) {

                    newStock = currentStock - units;
                }
                else {

                    process.emit(this.failedToUpdateProductStock_Event);

                    return;
                }
            }

            const promise = this.bamazonDB.queryDatabase('UPDATE products SET stock = ? WHERE id = ?', [newStock, id]);

            promise.then(([results]) => {

                if (results.changedRows > 0) {

                    process.emit(this.updateProductStock_Event);
                }
                else {

                    process.emit(this.failedToUpdateProductStock_Event);
                }

            }).catch((error) => {

                terminal.red(`   Error with BamazonDatabaseAPI function [`).white(`updateProductStock()`).red(`] ${error}\n\n`);

                process.emit(this.exitOnError_Event);
            });
        });

        this.getProductById(id);
    }
}


module.exports = BamazonDatabaseAPI;