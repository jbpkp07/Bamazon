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

        this.doPromptToContinueShopping = false;

        this.assignListeners();
    }

    assignListeners() {

        this.getAllProducts_Listener();

        this.updateProductStock_Listener();

        this.failedToUpdateProductStock_Listener();
    }

    getAllProducts_Listener() {

        process.on(this.bamazonDbAPI.getAllProducts_Event, ([rows, fields]) => {

            this.productsTableRows = rows;

            table.printProductsTable(rows, fields);

            if (!this.doPromptToContinueShopping) {

                this.promptProductToPurchase();
            }
            else {

                this.doPromptToContinueShopping = false;

                terminal.restoreCursor();

                this.promptContinueShopping();
            }
        });
    }

    updateProductStock_Listener() {

        process.on(this.bamazonDbAPI.updateProductStock_Event, () => {
  
            terminal.brightGreen("Done!\n\n");

            let cost = this.getTotalPurchaseCost(this.productId, this.productUnits);

            cost = "$" + cost.toFixed(2);

            terminal.gray("   Total cost of purchase: → ").brightGreen(`${cost}\n\n`);

            terminal.saveCursor();

            header.moveCursorToTop();

            this.doPromptToContinueShopping = true;

            this.bamazonDbAPI.getAllProducts();
        });
    }

    failedToUpdateProductStock_Listener() {

        process.on(this.bamazonDbAPI.failedToUpdateProductStock_Event, () => {
    
            terminal.red("Failed ").gray("Not enough current [stock] to satisy order, starting order again.\n\n");

            this.inquirerPrompts.printCountdown(10).then(() => {

                header.clearScreenBelowHeader();

                this.enterPortal();
            });
        });
    }

    enterPortal() {

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

                this.placeOrder();

            }, 500);
        });
    }

    placeOrder() {

        terminal.gray("   Placing order... → ");

        this.bamazonDbAPI.updateProductStock(this.productId, this.productUnits, false);
    }

    promptContinueShopping() {

        const promptMSG = "Would you like to continue shopping?";

        const name = "choice";

        const defaultChoice = true;

        const promise = this.inquirerPrompts.confirmPrompt(promptMSG, name, defaultChoice);

        promise.then((choice) => {

            if (choice[name]) {

                setTimeout(() => {
                
                    header.clearScreenBelowHeader();
    
                    this.enterPortal();
    
                }, 500);
            }
            else {

                setTimeout(() => {
                    
                    this.bamazonDbAPI.disconnect();

                }, 500);
            }
        });
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

    getPriceForId(idToCheck) {

        if (this.productsTableRows === null) {

            throw new Error("BamazonCustomerPortal.doesProductTableIdExist()  this.productsTableRows not yet defined");
        }

        let price = 0;

        for (const row of this.productsTableRows) {

            if (row.id === parseInt(idToCheck)) {

                price = row.price;
            }
        }

        return price;
    }

    getTotalPurchaseCost(id, units) {

        const price = this.getPriceForId(id);

        return price * units;
    }
}


module.exports = BamazonCustomerPortal;