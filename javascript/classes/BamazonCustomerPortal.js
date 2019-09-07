"use strict";
/* global require, process, module */

const terminal = require("terminal-kit").terminal;
const printTable = require('../functions/printTable.js');


// const printHeader = require('../functions/printHeader.js');
// const BamazonDatabaseAPI = require('./BamazonDatabaseAPI.js');


class BamazonCustomerPortal {

    constructor(bamazonDbAPI) {

        this.bamazonDbAPI = bamazonDbAPI;

        this.assignListeners();
    }

    assignListeners() {

        process.on(this.bamazonDbAPI.getAllProducts_Event, ([rows, fields]) => {

            printTable.printProductsTable(rows, fields);

            this.promptProductToPurchase();
        });
    }

    enterPortal() {

        this.bamazonDbAPI.getAllProducts();
    }

    promptProductToPurchase() {

        terminal.hideCursor("");  //with ("") it shows the cursor
        // terminal.white("   Which product would you like to purchase ?\n\n").gray("   ↑↓ + <enter>\n");


        const history = ['John', 'Jack', 'Joey', 'Billy', 'Bob'];

        const autoComplete = [
            'Barack Obama', 'George W. Bush', 'Bill Clinton', 'George Bush',
            'Ronald W. Reagan', 'Jimmy Carter', 'Gerald Ford', 'Richard Nixon',
            'Lyndon Johnson', 'John F. Kennedy', 'Dwight Eisenhower',
            'Harry Truman', 'Franklin Roosevelt'
        ];

        terminal.white("   Which product would you like to purchase? : ");


        const options2 = {
            style: terminal.cyan,
            selectedStyle: terminal.brightGreen
        };

        const options =
        {
            history: history,
            autoComplete: autoComplete,
            autoCompleteMenu: options2,

            autoCompleteHint: true,
            hintStyle: terminal.gray,
            style: terminal.cyan
        };

   

        
        const promise = terminal.inputField(options).promise;

        // function blah(error, input) {

        //     terminal.green("\nYour name is '%s'\n", input);
        //     process.exit();
        // }

        promise.then((choice) => {
   
            console.log("\n\n" + choice);
            terminal.grabInput(false); 
        });

        // var input = await term.inputField(options).promise;

        // term.green("\nYour name is '%s'\n", input);


        // function (error, input) {

        //     term.green("\nYour name is '%s'\n", input);
        //     process.exit();
        // }


        // const items = ["Customer".padEnd(13), "Manager".padEnd(13), "Supervisor".padEnd(13)];

        // const options =
        // {
        //     leftPadding: "   ",
        //     style: terminal.cyan,
        //     selectedStyle: terminal.brightGreen.bgGray,
        //     submittedStyle: terminal.brightGreen
        // };

        // const promise = terminal.singleColumnMenu(items, options).promise;

        // promise.then((choice) => {

        // terminal.grabInput(false);   //releases prompt code from hanging app

        // this.portalChoice = choice.selectedText.trim().toLowerCase();

        // setTimeout(() => {

        //     this.erasePreviousLines();

        //     this.enterPortal();

        // }, 1000);
        // });
    }

}




module.exports = BamazonCustomerPortal;