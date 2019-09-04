"use strict";
/* global require */

const terminal = require("terminal-kit").terminal;
const printHeader = require('./javascript/functions/printHeader.js');

const BamazonDatabase = require('./javascript/classes/BamazonDatabase.js');
const bamazonDB = new BamazonDatabase();


printHeader();

bamazonDB.connect().then(() => {

    bamazonDB.queryDatabase('SELECT * FROM ??', ["products"])
    .then(([rows, fields]) => {

        console.log(rows);

    }).catch((error) => {
        
        terminal.red(`   ${error}\n\n`);

    }).finally(() => {

        bamazonDB.disconnect();
    });

}).catch(() => { });



