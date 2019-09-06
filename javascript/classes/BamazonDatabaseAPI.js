"use strict";
/* global require, module, process */

const details = require('../../mysql_connection_details.js');
const MySQLDatabase = require('./MySQLDatabase.js');


class BamazonDatabaseAPI {

    constructor() {

        this.bamazonDB = new MySQLDatabase(details.host, details.port, details.multipleStatments, details.database, details.sqlSeedPath);

        this.connected_Event = "bamazonDBConnected";
        this.disconnected_Event = "bamazonDBDisconnected";
    }

    connect() {

        const promise = this.bamazonDB.connect();

        promise.then(() => {

            process.emit(this.connected_Event);

        }).catch(() => {});

        return promise;
    }

    disconnect() {

        const promise = this.bamazonDB.disconnect();

        promise.then(() => {

            process.emit(this.disconnected_Event);

        }).catch(() => {});

        return promise;
    }

    // bamazonDB.connect().then(() => {

    //     bamazonDB.queryDatabase('SELECT * FROM ??', ["products"])
    //     .then(([rows, fields]) => {

    //         console.log(rows);

    //     }).catch((error) => {

    //         terminal.red(`   ${error}\n\n`);

    //     }).finally(() => {

    //         bamazonDB.disconnect();
    //     });

    // }).catch(() => { });
}


module.exports = BamazonDatabaseAPI;