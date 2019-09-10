"use strict";
/* global require, process, module */

const terminal = require("terminal-kit").terminal;
const table = require('../functions/printTableFunctions.js');
const header = require('../functions/printHeaderFunctions.js');
const InquirerPrompts = require('./InquirerPrompts.js');


class BamazonCustomerPortal {

    constructor(bamazonDbAPI) {

        this.bamazonDbAPI = bamazonDbAPI;
        this.inquirerPrompts = new InquirerPrompts();

        this.productsTableRows = null;

        this.productId = null;
        this.productUnits = null;
    }

    enterPortal() {

        process.once(this.bamazonDbAPI.getAllProducts_Event, ([rows, fields]) => {

            this.productsTableRows = rows;

            table.printProductsTable(rows, fields);

            this.promptProductToPurchase();
        });

        this.bamazonDbAPI.getAllProducts();
    }

    promptProductToPurchase() {

        const promptMSG = "Which product id to purchase?  [id] →";

        const name = "id";

        const validateFunc = (userInput) => {

            if (!this.inquirerPrompts.isNumber(userInput)) {

                return false;
            }

            if (!this.inquirerPrompts.isInteger(userInput)) {

                return false;
            }

            if (!this.doesProductTableIdExist(userInput)) {

                setTimeout(() => { terminal.brightRed("  [id] is not valid"); }, 0);

                return false;
            }

            if (!this.isEnoughStockForId(userInput, 1)) {

                setTimeout(() => { terminal.brightRed("  product is out of [stock]"); }, 0);

                return false;
            }

            return true;
        };

        const promise = this.inquirerPrompts.inputPrompt(promptMSG, name, validateFunc);

        promise.then((choice) => {

            this.productId = parseInt(choice[name]);

            setTimeout(() => {

                terminal("\n");

                this.promptNumberOfUnits();

            }, 500);
        });
    }

    promptNumberOfUnits() {

        const promptMSG = "How many units to purchase? [stock] →";

        const name = "units";

        const validateFunc = (userInput) => {

            if (!this.inquirerPrompts.isNumber(userInput)) {

                return false;
            }

            if (!this.inquirerPrompts.isInteger(userInput)) {

                return false;
            }

            if (!this.inquirerPrompts.isPositiveInteger(userInput)) {

                return false;
            }

            if (!this.isEnoughStockForId(this.productId, userInput)) {

                setTimeout(() => { terminal.brightRed("  not enough [stock] to place order"); }, 0);

                return false;
            }

            return true;
        };

        const promise = this.inquirerPrompts.inputPrompt(promptMSG, name, validateFunc);

        promise.then((choice) => {

            this.productUnits = parseInt(choice[name]);

            setTimeout(() => {

                terminal("\n");

                terminal.white("   Placing order... → ");

                this.placeOrder();

            }, 500);
        });
    }

    placeOrder() {

        process.once(this.bamazonDbAPI.updateProductStock_Event, () => {

            terminal.brightGreen("Done!");

            setTimeout(() => {
    
                header.clearScreenBelowHeader();

                process.once(this.bamazonDbAPI.getAllProducts_Event, ([rows, fields]) => {

                    this.productsTableRows = rows;
        
                    table.printProductsTable(rows, fields);
                });
        
                this.bamazonDbAPI.getAllProducts();

            }, 2000);
        });

        process.once(this.bamazonDbAPI.failedToUpdateProductStock_Event, () => {

            terminal.red("Failed ").gray("Not enough current [stock] to satisy order, starting order again:  ");

            let count = 5;

            terminal.white(count.toString());
            count--;
            terminal.left(1);

            const intervalId = setInterval(() => {
            
                terminal.white(count.toString());
                count--;
                terminal.left(1);

            }, 1000);

            setTimeout(() => {
    
                clearInterval(intervalId);

                header.clearScreenBelowHeader();

                this.enterPortal();

            }, 6000);
        });

        this.bamazonDbAPI.updateProductStock(this.productId, this.productUnits, false);
    }

    doesProductTableIdExist(idToCheck) {

        if (this.productsTableRows === null) {

            throw new Error("BamazonCustomerPortal.doesProductTableIdExist()  this.productsTableRows not yet defined");
        }

        let doesIdExist = false;

        for (const row of this.productsTableRows) {

            if (row.id === parseInt(idToCheck)) {

                doesIdExist = true;
            }
        }

        return doesIdExist;
    }

    isEnoughStockForId(idToCheck, units) {

        if (this.productsTableRows === null) {

            throw new Error("BamazonCustomerPortal.doesProductTableIdExist()  this.productsTableRows not yet defined");
        }

        let isEnoughStock = false;

        for (const row of this.productsTableRows) {

            if (row.id === parseInt(idToCheck) && row.stock >= parseInt(units)) {

                isEnoughStock = true;
            }
        }

        return isEnoughStock;
    }
}




module.exports = BamazonCustomerPortal;