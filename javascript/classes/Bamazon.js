"use strict";
/* global require, process, module */

const terminal = require("terminal-kit").terminal;
const printHeader = require('../functions/printHeader.js');
const BamazonDatabaseAPI = require('./BamazonDatabaseAPI.js');


class Bamazon {

    constructor() {

        this.bamazonDbAPI = new BamazonDatabaseAPI();

        this.portalChoice = null;
    }

    startApp() {

        printHeader();

        this.bamazonDbAPI.connect().then(() => {

            terminal.saveCursor();

            this.choosePortal();

        }).catch(this.skipCatch);
    }

    choosePortal() {

        terminal.hideCursor();
        terminal.white("   Choose Portal...\n\n").gray("   ↑↓ + <enter>\n");

        const items = ["Customer".padEnd(13), "Manager".padEnd(13), "Supervisor".padEnd(13)];

        const options =
        {
            leftPadding: "   ",
            style: terminal.cyan,
            selectedStyle: terminal.brightGreen.bgGray,
            submittedStyle: terminal.brightGreen
        };

        const promise = terminal.singleColumnMenu(items, options).promise;

        promise.then((choice) => {

            terminal.grabInput(false);   //releases prompt code from hanging app

            this.portalChoice = choice.selectedText.trim().toLowerCase();

            setTimeout(() => {

                this.erasePreviousLines();

                this.enterPortal();

            }, 1000);
        });
    }

    enterPortal() {

        switch (this.portalChoice) {

            case 'customer':

                break;
            case 'manager':

                break;
            case 'supervisor':

                break;
        }

        this.exit();
    }

    erasePreviousLines() {

        terminal.restoreCursor();

        terminal.eraseDisplayBelow();
    }

    skipCatch() { /* Error handling / console logging done downstream */ }

    exit() {

        this.bamazonDbAPI.disconnect().then(() => {
            
            terminal.hideCursor("");  //with ("") it shows the cursor
            
            process.exit(0);

        }).catch(this.skipCatch);
    }
}


module.exports = Bamazon;