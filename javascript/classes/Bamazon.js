"use strict";
/* global require, process, module */

const terminal = require("terminal-kit").terminal;
const printHeader = require('../functions/printHeader.js');
const InquirerPrompts = require('./InquirerPrompts.js');
const BamazonDatabaseAPI = require('./BamazonDatabaseAPI.js');
const BamazonCustomerPortal = require('./BamazonCustomerPortal.js');


class Bamazon {

    constructor() {

        this.bamazonDbAPI = new BamazonDatabaseAPI();

        this.inquirerPrompts = new InquirerPrompts();

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

        const promptMSG = "Choose Portal...";
        const name = "portal";
        const portals = ["Customer", "Manager", "Supervisor", "Whatever"];  
        
        const promise = this.inquirerPrompts.listPrompt(promptMSG, name, portals);

        promise.then((choice) => {
    
            this.portalChoice = choice[name].trim();
            
            setTimeout(() => {
        
                this.clearScreenBelowHeader();
                this.choosePortal();
                // this.enterPortal();
       
            }, 1000);
        });
    }

    enterPortal() {

        switch (this.portalChoice) {

            case 'Customer':
                this.bamazonCustomerPortal = new BamazonCustomerPortal(this.bamazonDbAPI);
                this.bamazonCustomerPortal.enterPortal();
                break;
            case 'Manager':

                break;
            case 'Supervisor':

                break;
        }

        // this.bamazonDbAPI.disconnect();
    }

    clearScreenBelowHeader() {

        terminal.restoreCursor();

        terminal.eraseDisplayBelow();
    }

    exit() {

        terminal.hideCursor("");  //with ("") it shows the cursor

        process.exit(0);
    }
}


module.exports = Bamazon;