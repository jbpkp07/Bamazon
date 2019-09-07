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

        const promise = this.bamazonDB.queryDatabase('SELECT * FROM ??', ["products"]);

        promise.then(([rows, fields]) => {

            process.emit(this.getAllProducts_Event, [rows, fields]);

        }).catch((error) => {

            terminal.red(`   Error with BamazonDatabaseAPI function [`).white(`getAllProducts()`).red(`] ${error}\n\n`);

            process.emit(this.exitOnError_Event);
        });
    }
}


module.exports = BamazonDatabaseAPI;