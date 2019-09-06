"use strict";
/* global require */

const Bamazon = require('./javascript/classes/Bamazon.js');

const bamazon = new Bamazon();

bamazon.startApp();


// const Utility = require("./javascript/classes/Utility.js");



// class listenerObject {

//     constructor() {

//         this._data = 0;
//     }

//     set data(value) {

//         this._data = value;
//         this.dataEvtEmitter("weird");
//     }

//     get data() {

//         return this._data;
//     }

//     dataEvtEmitter() {

//         console.log("No emitter registered");
//     }

//     registerEmitter(evtEmitterFunc) {

//         this.dataEvtEmitter = evtEmitterFunc;
//     }
// }







// const obj = new listenerObject();

// obj.dataEvtEmitter();

// obj.data = 1;
// obj.data = 2;
// obj.data = 3;

// console.log(obj.data);
// console.log(obj.data);


// // const promise = new Promise();



// obj.registerEmitter((value) => {

//     process.emit("_dataUpdated", value);
// });


// process.on("_dataUpdated", (value) => {
   
//     console.log(obj.data);
//     console.log(value);
// });






// Utility.setEvtEmitterRepeating(() => true, 100, "_dataUpdated");








// setTimeout(() => {
    
//     obj.data = 4;

//     setTimeout(() => {
    
//         obj.data = 5;
//         setTimeout(() => {
    
//             obj.data = 6;
        
//             setTimeout(() => {
            
//                 obj.data = 7;
        
//             }, 1000);
        
//         }, 1000);
//     }, 1000);

// }, 1000);











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