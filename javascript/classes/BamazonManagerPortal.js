"use strict";
/* global require, process, module */

const terminal = require("terminal-kit").terminal;
const table = require('../functions/printTableFunctions.js');
const header = require('../functions/printHeaderFunctions.js');
const InquirerPrompts = require('./InquirerPrompts.js');


class BamazonManagerPortal {

    constructor(bamazonDbAPI) {

        this.bamazonDbAPI = bamazonDbAPI;
        this.inquirerPrompts = new InquirerPrompts();

        this.productsTableRows = null;

        this.productId = null;
        this.productUnits = null;

        this.newProductToAddOBJ = null;
        this.productsTableFields = null;

        this.assignListeners();
    }

    assignListeners() {

    }

    enterPortal() {

        setTimeout(() => {

            this.promptChooseAction();

        }, 500);
    }

    promptChooseAction() {

        const promptMSG = "Choose Action...";
        const name = "action";
        const actions = ["View products for sale", "View low inventory", "Add to inventory", "Add new product", "Exit"];

        const promise = this.inquirerPrompts.listPrompt(promptMSG, name, actions);

        promise.then((choice) => {

            this.portalChoice = choice[name].trim();

            setTimeout(() => {

                header.clearScreenBelowHeader();

                switch (choice[name].trim()) {

                    case "View products for sale":
                        this.viewProductsForSale();
                        break;
                    case "View low inventory":
                        this.viewLowInventory();
                        break;
                    case "Add to inventory":
                        this.addToInventory();
                        break;
                    case "Add new product":
                        this.addNewProduct();
                        break;
                    case "Exit":
                        this.bamazonDbAPI.disconnect();
                        break;
                }

            }, 500);
        });
    }

    viewProductsForSale() {

        process.once(this.bamazonDbAPI.getAllProducts_Event, ([rows, fields]) => {

            this.productsTableRows = rows;

            table.printProductsTable(rows, fields);

            this.promptChooseAction();
        });

        setTimeout(() => {

            this.bamazonDbAPI.getAllProducts();

        }, 500);
    }

    viewLowInventory() {

        process.once(this.bamazonDbAPI.getProductsByStockAmount_Event, ([rows, fields]) => {

            this.productsTableRows = rows;

            table.printProductsTable(rows, fields);

            this.promptChooseAction();
        });

        setTimeout(() => {

            this.bamazonDbAPI.getProductsByStockAmount(5, true);

        }, 500);
    }

    addToInventory() {

        process.once(this.bamazonDbAPI.getAllProducts_Event, ([rows, fields]) => {

            this.productsTableRows = rows;

            table.printProductsTable(rows, fields);

            this.promptProductToAddStock();
        });

        setTimeout(() => {

            this.bamazonDbAPI.getAllProducts();

        }, 500);
    }

    promptProductToAddStock() {

        const promptMSG = "Which product id to add stock?  [id] →";

        const name = "id";

        const validateFunc = (userInput) => {

            if (!this.inquirerPrompts.validateIsPositiveInteger(userInput)) {

                return false;
            }

            if (!this.doesProductTableIdExist(userInput)) {

                setTimeout(() => { terminal.brightRed("  [id] is not valid"); }, 0);

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

        const promptMSG = "How many units to add? [stock] →";

        const name = "units";

        const validateFunc = (userInput) => {

            if (!this.inquirerPrompts.validateIsPositiveInteger(userInput)) {

                return false;
            }

            return true;
        };

        const promise = this.inquirerPrompts.inputPrompt(promptMSG, name, validateFunc);

        promise.then((choice) => {

            this.productUnits = parseInt(choice[name]);

            setTimeout(() => {

                this.addingStock();

            }, 500);
        });
    }

    addingStock() {

        process.once(this.bamazonDbAPI.updateProductStock_Event, () => {

            terminal.brightGreen("Done!\n\n");

            terminal.saveCursor();

            header.moveCursorToTop();

            this.bamazonDbAPI.getAllProducts();
        });

        process.once(this.bamazonDbAPI.getAllProducts_Event, ([rows, fields]) => {

            this.productsTableRows = rows;

            table.printProductsTable(rows, fields);

            terminal.restoreCursor();

            this.promptChooseAction();
        });

        terminal.gray("   Adding Stock... → ");

        this.bamazonDbAPI.updateProductStock(this.productId, this.productUnits, true);
    }

    addNewProduct() {

        this.newProductToAddOBJ =
            {
                id: "##",
                product: "------------------------------",
                department_id: "----------",
                price: 0.00,
                stock: "-----"
            };

        this.productsTableFields =
            [
                { name: 'id' },
                { name: 'product' },
                { name: 'department' },
                { name: 'price' },
                { name: 'stock' }
            ];

        setTimeout(() => {

            this.printAddNewProductTable();

            this.promptNewProductName();

        }, 500);
    }

    promptNewProductName() {

        const promptMSG = "What is the product name? [product] →";

        const name = "product";

        const validateFunc = (userInput) => {

            if (!this.inquirerPrompts.isLengthGreaterThanValue(userInput, 4)) {

                return false;
            }

            return true;
        };

        const promise = this.inquirerPrompts.inputPrompt(promptMSG, name, validateFunc);

        promise.then((choice) => {

            this.newProductToAddOBJ.product = choice[name];

            setTimeout(() => {

                header.clearScreenBelowHeader();

                this.printAddNewProductTable();

                this.promptNewProductDepartment();

            }, 500);
        });
    }

    promptNewProductDepartment() {

        process.once(this.bamazonDbAPI.getAllDepartments_Event, ([rows, fields]) => {
            
            const promptMSG = "What is the department name? [department]";

            const name = "department";
            
            const departments = [];

            for (const row of rows) {

                departments.push(row.id + " → " + row.name);
            }
    
            const promise = this.inquirerPrompts.listPrompt(promptMSG, name, departments);
    
            promise.then((choice) => {
    
                const department = choice[name].trim();

                const department_id = parseInt(department.split(" → ")[0]);

                this.newProductToAddOBJ.department_id = department_id;
    
                setTimeout(() => {
       
                    header.clearScreenBelowHeader();
    
                    this.printAddNewProductTable();
    
                    this.promptNewProductPrice();
    
                }, 500);
            });
        });

        this.bamazonDbAPI.getAllDepartments();
    }

    promptNewProductPrice() {

        const promptMSG = "What is the price? [price] →";

        const name = "price";

        const validateFunc = (userInput) => {

            if (!this.inquirerPrompts.validateIsPositiveNumber(userInput)) {

                return false;
            }

            return true;
        };

        const promise = this.inquirerPrompts.inputPrompt(promptMSG, name, validateFunc);

        promise.then((choice) => {

            this.newProductToAddOBJ.price = parseFloat(choice[name]);

            setTimeout(() => {

                header.clearScreenBelowHeader();

                this.printAddNewProductTable();

                this.promptNewProductStock();

            }, 500);
        });
    }

    promptNewProductStock() {

        const promptMSG = "What is the stock amount? [stock] →";

        const name = "stock";

        const validateFunc = (userInput) => {

            if (!this.inquirerPrompts.validateIsPositiveInteger(userInput)) {

                return false;
            }

            return true;
        };

        const promise = this.inquirerPrompts.inputPrompt(promptMSG, name, validateFunc);

        promise.then((choice) => {

            this.newProductToAddOBJ.stock = parseInt(choice[name]);

            setTimeout(() => {
                
                header.clearScreenBelowHeader();

                this.printAddNewProductTable();

                this.addingNewProduct();

            }, 500);
        });
    }

    addingNewProduct() {

        process.once(this.bamazonDbAPI.addNewProduct_Event, (response) => {

            if (response.result === true) {

                terminal.brightGreen("Done!\n\n");
            }
            else {

                terminal.red("Failed!").gray(" New product not added...");
            }
     
            setTimeout(() => {
                
                header.clearScreenBelowHeader();

                this.viewProductsForSale();

            }, 2000);
        });

        terminal.gray("   Adding New Product... → ");

        this.bamazonDbAPI.addNewProduct(this.newProductToAddOBJ);
    }

    printAddNewProductTable() {

        terminal.hideCursor();

        terminal.white("   Add new product...\n\n");

        table.printProductsTable([this.newProductToAddOBJ], this.productsTableFields);
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
}


module.exports = BamazonManagerPortal;