"use strict";
/* global require */

const Bamazon = require('./javascript/classes/Bamazon.js');

const bamazon = new Bamazon();

bamazon.startApp();










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




// function choosePortal() {

//     const inquirer = require('inquirer');

//     const items = [ "", " Customer", " Manager", " Supervisor" ];

//     const prompt =
//     {
//         name: "portal",
//         type: "list",
//         choices: items,
//         default: 0,
//         message: ` Choose Portal...\n  `
//     };

//     const promise = inquirer.prompt([prompt]);

//     return promise;
// }

// choosePortal().then((answer) => {

//         erasePreviousLines();
//         console.log("[" + answer.portal.trim() + "]");
//         terminal.hideCursor("");
//         // process.exit(0);
// });