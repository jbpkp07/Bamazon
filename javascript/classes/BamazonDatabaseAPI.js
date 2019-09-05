"use strict";
/* global require, module */

const BamazonDatabase = require('./BamazonDatabase.js');


class BamazonDatabaseAPI {

    constructor() {

        this.bamazonDB = new BamazonDatabase();
    }

    connect() {

        const promise = this.bamazonDB.connect();

        return promise;
    }

    disconnect() {

        const promise = this.bamazonDB.disconnect();

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