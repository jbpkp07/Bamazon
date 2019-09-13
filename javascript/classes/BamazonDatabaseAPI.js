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
        this.getProductsByStockAmount_Event = "bamazonGotProductsByStockAmount";
        this.updateProductStock_Event = "bamazonUpdatedProductStock";
        this.updateProductSales_Event = "bamazonUpdatedProductSales";
        this.addNewProduct_Event = "bamazonAddedNewProduct";
        this.getAllDepartments_Event = "bamazonGotAllDepartmentsNames";
        this.addNewDepartment_Event = "bamazonAddedNewDepartment";
        this.getProductSalesByDepartment_Event = "bamazonGotProductSalesByDepartment";
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

    getAllProductsQuery(appendedCondition) {

        if (typeof appendedCondition === 'undefined') {

            appendedCondition = "";
        }

        const query = `SELECT   products.id, 
		                        products.product, 
                                departments.name AS department, 
                                products.price, 
                                products.stock, 
                                products.sales 
                        FROM products
                        INNER JOIN departments ON products.department_id = departments.id
                        ${appendedCondition}
                        ORDER BY products.id`;
        return query;
    }

    getAllProducts() {

        const query = this.getAllProductsQuery();

        const promise = this.bamazonDB.queryDatabase(query);

        promise.then(([rows, fields]) => {

            for (const row of rows) {

                row.price = parseFloat(row.price);  //convert from DECIMAL(9,2), which is read as a string, to javascript float
                row.sales = parseFloat(row.sales);  //convert from DECIMAL(12,2), which is read as a string, to javascript float
            }

            process.emit(this.getAllProducts_Event, [rows, fields]);

        }).catch((error) => {

            terminal.red(`  Error with BamazonDatabaseAPI function [`).white(`getAllProducts()`).red(`] ${error}\n\n`);

            process.emit(this.exitOnError_Event);
        });
    }

    getProductById(id) {

        const query = this.getAllProductsQuery(`WHERE products.id = ?`);

        const promise = this.bamazonDB.queryDatabase(query, [id]);

        promise.then(([rows, fields]) => {

            for (const row of rows) {

                row.price = parseFloat(row.price);  //convert from DECIMAL(9,2), which is read as a string, to javascript float
                row.sales = parseFloat(row.sales);  //convert from DECIMAL(12,2), which is read as a string, to javascript float
            }

            process.emit(this.getProductById_Event, [rows, fields]);

        }).catch((error) => {

            terminal.red(`  Error with BamazonDatabaseAPI function [`).white(`getProductById()`).red(`] ${error}\n\n`);

            process.emit(this.exitOnError_Event);
        });
    }

    getProductsByStockAmount(sqlComparisonOperatorSTR, amount) {

        const query = this.getAllProductsQuery(`WHERE products.stock ${sqlComparisonOperatorSTR} ?`);

        const promise = this.bamazonDB.queryDatabase(query, [amount]);

        promise.then(([rows, fields]) => {

            for (const row of rows) {

                row.price = parseFloat(row.price);  //convert from DECIMAL(9,2), which is read as a string, to javascript float
                row.sales = parseFloat(row.sales);  //convert from DECIMAL(12,2), which is read as a string, to javascript float
            }

            process.emit(this.getProductsByStockAmount_Event, [rows, fields]);

        }).catch((error) => {

            terminal.red(`  Error with BamazonDatabaseAPI function [`).white(`getProductsByStockAmount()`).red(`] ${error}\n\n`);

            process.emit(this.exitOnError_Event);
        });
    }

    updateProductStock(id, sqlArithmeticOperatorSTR, units) {

        process.once(this.getProductById_Event, ([rows, fields]) => {

            const currentStock = rows[0].stock;

            const newStock = eval(`${currentStock} ${sqlArithmeticOperatorSTR} ${units}`);

            if (newStock < 0) {

                process.emit(this.updateProductStock_Event, { wasSuccessful: false });

                return;
            }

            const promise = this.bamazonDB.queryDatabase('UPDATE products SET stock = ? WHERE id = ?', [newStock, id]);

            promise.then(([results]) => {

                if (results.changedRows > 0) {

                    process.emit(this.updateProductStock_Event, { wasSuccessful: true });
                }
                else {

                    process.emit(this.updateProductStock_Event, { wasSuccessful: false });
                }

            }).catch((error) => {

                terminal.red(`  Error with BamazonDatabaseAPI function [`).white(`updateProductStock()`).red(`] ${error}\n\n`);

                process.emit(this.exitOnError_Event);
            });
        });

        this.getProductById(id);
    }

    updateProductSales(id, purchaseCost) {

        const promise = this.bamazonDB.queryDatabase('UPDATE products SET sales = sales + ? WHERE id = ?', [purchaseCost, id]);

        promise.then(([results]) => {

            if (results.changedRows > 0) {

                process.emit(this.updateProductSales_Event, { wasSuccessful: true });
            }
            else {

                process.emit(this.updateProductSales_Event, { wasSuccessful: false });
            }

        }).catch((error) => {

            terminal.red(`  Error with BamazonDatabaseAPI function [`).white(`updateProductSales()`).red(`] ${error}\n\n`);

            process.emit(this.exitOnError_Event);
        });
    }

    addNewProduct(newProductOBJ) {

        if (newProductOBJ.id) {

            delete newProductOBJ.id;  //Auto increments, don't specify product id
        }

        const query = `INSERT INTO products SET ?`;

        const promise = this.bamazonDB.queryDatabase(query, newProductOBJ);

        promise.then(([results]) => {

            if (results.affectedRows > 0) {

                process.emit(this.addNewProduct_Event, { wasSuccessful: true });
            }
            else {

                process.emit(this.addNewProduct_Event, { wasSuccessful: false });
            }

        }).catch((error) => {

            terminal.red(`  Error with BamazonDatabaseAPI function [`).white(`addNewProduct()`).red(`] ${error}\n\n`);

            process.emit(this.exitOnError_Event);
        });
    }

    getAllDepartments() {

        const query = `SELECT * FROM departments;`;

        const promise = this.bamazonDB.queryDatabase(query);

        promise.then(([rows, fields]) => {

            for (const row of rows) {

                row.overhead = parseFloat(row.overhead);  //convert from DECIMAL(9,2), which is read as a string, to javascript float
            }

            process.emit(this.getAllDepartments_Event, [rows, fields]);

        }).catch((error) => {

            terminal.red(`  Error with BamazonDatabaseAPI function [`).white(`getAllDepartments()`).red(`] ${error}\n\n`);

            process.emit(this.exitOnError_Event);
        });
    }

    addNewDepartment(newDepartmentOBJ) {

        if (newDepartmentOBJ.id) {

            delete newDepartmentOBJ.id;  //Auto increments, don't specify product id
        }

        const query = `INSERT INTO departments SET ?`;

        const promise = this.bamazonDB.queryDatabase(query, newDepartmentOBJ);

        promise.then(([results]) => {

            if (results.affectedRows > 0) {

                process.emit(this.addNewDepartment_Event, { wasSuccessful: true });
            }
            else {

                process.emit(this.addNewDepartment_Event, { wasSuccessful: false });
            }

        }).catch((error) => {

            terminal.red(`  Error with BamazonDatabaseAPI function [`).white(`addNewDepartment()`).red(`] ${error}\n\n`);

            process.emit(this.exitOnError_Event);
        });
    }

    getProductSalesByDeparment() {

        const query =   `SELECT
                            departments.id AS id,
                            departments.name AS department,
                            departments.overhead AS overhead,
                            SUM(IFNULL(products.sales, 0)) AS sales,
                            SUM(IFNULL(products.sales, 0)) - departments.overhead AS profit
                        FROM departments
                        LEFT JOIN products ON products.department_id = departments.id
                        GROUP BY departments.id;`;

        const promise = this.bamazonDB.queryDatabase(query);

        promise.then(([rows, fields]) => {

            for (const row of rows) {

                row.overhead = parseFloat(row.overhead);  //convert from DECIMAL(9,2), which is read as a string, to javascript float
                row.sales    = parseFloat(row.sales);     //convert from DECIMAL(9,2), which is read as a string, to javascript float
                row.profit   = parseFloat(row.profit);    //convert from DECIMAL(9,2), which is read as a string, to javascript float
            }

            process.emit(this.getProductSalesByDepartment_Event, [rows, fields]);

        }).catch((error) => {

            terminal.red(`  Error with BamazonDatabaseAPI function [`).white(`getProductSalesByDeparment()`).red(`] ${error}\n\n`);

            process.emit(this.exitOnError_Event);
        });
    }
}


module.exports = BamazonDatabaseAPI;