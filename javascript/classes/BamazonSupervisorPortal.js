"use strict";
/* global require, process, module */

const terminal = require("terminal-kit").terminal;
const table = require('../functions/printTableFunctions.js');
const header = require('../functions/printHeaderFunctions.js');
const InquirerPrompts = require('./InquirerPrompts.js');


class BamazonSupervisorPortal {

    constructor(bamazonDbAPI) {

        this.bamazonDbAPI = bamazonDbAPI;
        this.inquirerPrompts = new InquirerPrompts();

        this.newDepartmentToAddOBJ = null;
        this.departmentsTableFields = null;
    }

    enterPortal() {

        setTimeout(() => {

            this.promptChooseAction();

        }, 500);
    }

    promptChooseAction() {

        const promptMSG = "Choose action...";
        const name = "action";
        const actions = ["Create new department", "View product sales by department", "Exit"];

        const promise = this.inquirerPrompts.listPrompt(promptMSG, name, actions);

        promise.then((choice) => {

            this.portalChoice = choice[name];

            setTimeout(() => {

                header.clearScreenBelowHeader();

                switch (this.portalChoice) {

                    case "Create new department":
                        this.createNewDepartment();
                        break;
                    case "View product sales by department":
                        this.viewProductSalesByDepartment();
                        break;
                    case "Exit":
                        this.bamazonDbAPI.disconnect();
                        break;
                }

            }, 500);
        });
    }

    createNewDepartment() {

        this.newDepartmentToAddOBJ =
            {
                id: "##",
                name: "---------------",
                overhead: 0.00
            };

        this.departmentsTableFields =
            [
                { name: 'id' },
                { name: 'department' },
                { name: 'overhead' }
            ];

        setTimeout(() => {

            this.printAddNewDepartmentTable();

            this.promptNewDepartmentName();

        }, 500);
    }

    promptNewDepartmentName() {

        const promptMSG = "What is the department name? [department] →";

        const name = "department";

        const validateFunc = (userInput) => {

            if (!this.inquirerPrompts.validateIsLengthGreaterThanValue(userInput, 3)) {

                return false;
            }

            return true;
        };

        const promise = this.inquirerPrompts.inputPrompt(promptMSG, name, validateFunc);

        promise.then((choice) => {

            this.newDepartmentToAddOBJ.name = choice[name].trim();

            setTimeout(() => {

                header.clearScreenBelowHeader();

                this.printAddNewDepartmentTable();

                this.promptOverheadCosts();

            }, 500);
        });
    }

    promptOverheadCosts() {

        const promptMSG = "What is the overhead cost? [overhead] →";

        const name = "overhead";

        const validateFunc = (userInput) => {

            if (!this.inquirerPrompts.validateIsPositiveNumber(userInput)) {

                return false;
            }

            return true;
        };

        const promise = this.inquirerPrompts.inputPrompt(promptMSG, name, validateFunc);

        promise.then((choice) => {

            this.newDepartmentToAddOBJ.overhead = parseFloat(choice[name]);

            setTimeout(() => {

                header.clearScreenBelowHeader();

                this.printAddNewDepartmentTable();

                this.addingNewDepartment();

            }, 500);
        });
    }

    addingNewDepartment() {

        process.once(this.bamazonDbAPI.addNewDepartment_Event, (result) => {

            if (result.wasSuccessful) {

                terminal.brightGreen("Done\n\n");
            }
            else {

                terminal.red("Failed: ").gray("New department not added...");
            }
     
            setTimeout(() => {
                
                header.clearScreenBelowHeader();

                this.promptChooseAction();

            }, 2000);
        });

        terminal.gray("  ► Adding new department... → ");

        this.bamazonDbAPI.addNewDepartment(this.newDepartmentToAddOBJ);
    }

    viewProductSalesByDepartment() {

        process.once(this.bamazonDbAPI.getProductSalesByDepartment_Event, ([rows, fields]) => { 

            table.printDepartmentsTable(rows, fields);

            this.promptChooseAction();
        });

        setTimeout(() => {

            this.bamazonDbAPI.getProductSalesByDeparment();

        }, 500);
    }

    printAddNewDepartmentTable() {

        terminal.hideCursor();

        terminal.white("  Add new department...\n\n");

        table.printDepartmentsTable([this.newDepartmentToAddOBJ], this.departmentsTableFields);
    }
}


module.exports = BamazonSupervisorPortal;