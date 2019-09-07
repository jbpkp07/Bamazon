"use strict";
/* global require, process, module */

const terminal = require("terminal-kit").terminal;
const printHeader = require('../functions/printHeader.js');
const BamazonDatabaseAPI = require('./BamazonDatabaseAPI.js');
const BamazonCustomerPortal = require('./BamazonCustomerPortal.js');


class Bamazon {

    constructor() {

        this.bamazonDbAPI = new BamazonDatabaseAPI();

        this.portalChoice = null;

        this.bamazonCustomerPortal = null;

        this.assignListeners();
    }

    assignListeners() {

        process.once(this.bamazonDbAPI.connected_Event, () => {

            terminal.saveCursor();

            this.choosePortal();
        });

        process.once(this.bamazonDbAPI.disconnected_Event, () => {

            this.exit();
        });

        process.once(this.bamazonDbAPI.exitOnError_Event, () => {

            this.exit();
        });
    }

    startApp() {

        printHeader();

        this.bamazonDbAPI.connect();
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
                this.bamazonCustomerPortal = new BamazonCustomerPortal(this.bamazonDbAPI);
                this.bamazonCustomerPortal.enterPortal();
                break;
            case 'manager':

                break;
            case 'supervisor':

                break;
        }

        // this.bamazonDbAPI.disconnect();
    }

    erasePreviousLines() {

        terminal.restoreCursor();

        terminal.eraseDisplayBelow();
    }

    exit() {

        terminal.hideCursor("");  //with ("") it shows the cursor

        process.exit(0);
    }
}


module.exports = Bamazon;