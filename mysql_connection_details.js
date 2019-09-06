"use strict";
/* global require, module, __dirname */

const path = require('path');


//Start config here------------------------------------------------------------
const host = "localhost";
const port = 3306;
const multipleStatments = true;
const database = "bamazon";
const sqlSeedPath = path.join(__dirname, './sql/BamazonSeed.sql');
//End config here--------------------------------------------------------------


module.exports = {

   host: host,
   port: port,
   multipleStatments: multipleStatments,
   database: database,
   sqlSeedPath: sqlSeedPath
};