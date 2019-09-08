"use strict";
/* global require, module, process */

const terminal = require("terminal-kit").terminal;
const inquirer = require('inquirer');


class InquirerPrompts {

    constructor() {

        this.listPromptLength = null;

        this.tidyListPromptBound = this.tidyListPrompt.bind(this);

        this.tidyInputPromptMessageBound = this.tidyInputPromptMessage.bind(this);
    }

    listPrompt(promptMsg, name, choicesArray) {

        promptMsg = "   " + promptMsg;  //padded for indenting purposes

        for (let i = 0; i < choicesArray.length; i++) {

            choicesArray[i] = " " + choicesArray[i];  //padded for indenting purposes
        }

        terminal.white(`${promptMsg}\n\n`).gray("   ↑↓ + <enter>\n");

        const promptOBJ =
        {
            name: name,
            type: "list",
            choices: choicesArray,
            default: 0,
            message: " "
        };

        this.listPromptLength = choicesArray.length;

        const promise = inquirer.prompt(promptOBJ);

        this.tidyListPromptMessage(this.listPromptLength);

        process.stdin.on('keypress', this.tidyListPromptBound);

        promise.then((choice) => {

            process.stdin.off('keypress', this.tidyListPromptBound);

            terminal.cyan("   " + choice[name].trim());
        });

        return promise;
    }

    tidyListPrompt(str, key) {

        if (key.name === "up" || key.name === "down") {

            setTimeout(() => {

                this.tidyListPromptMessage(this.listPromptLength);

            }, 0);  //end of event loop to erase inquirer text
        }
        else if (key.name === "return") {

            setTimeout(() => {

                this.tidyListPromptMessage(1);

                terminal.hideCursor();

            }, 0);  //end of event loop to erase inquirer text
        }
    }

    tidyListPromptMessage(distance) {

        terminal.up(distance);
        terminal.eraseLine();
        terminal.down(distance);
    }

    inputPrompt(promptMsg, name, validateFunc) {

        terminal.hideCursor("");   //shows cursor when ("")

        promptMsg = " " + promptMsg;  //padded for indenting purposes

        const promptOBJ =
        {
            name: name,
            type: "input",
            message: promptMsg
        };
     
        if (typeof validateFunc === 'function') {

            promptOBJ.validate = validateFunc;
        }

        const promise = inquirer.prompt(promptOBJ);

        this.tidyInputPromptMessage();

        process.stdin.on('keypress', this.tidyInputPromptMessageBound);

        promise.then(() => {

            process.stdin.off('keypress', this.tidyInputPromptMessageBound);

            terminal.hideCursor();
        });

        return promise;
    }

    tidyInputPromptMessage() {

        setTimeout(() => {

            terminal.saveCursor();
            terminal.column(0);
            terminal.black(" ");
            terminal.up(1);
            terminal.column(0);
            terminal.black(" ");
            terminal.restoreCursor();

        }, 0);  //end of event loop to erase inquirer text
    }

    isNumber(userInput) {

        if (isNaN(userInput)) {

            setTimeout(() => { terminal.brightRed("  please enter a number"); }, 0);

            return false;
        }

        return true;
    }

    isInteger(userInput) {

        if (parseInt(userInput) !== parseFloat(userInput)) {

            setTimeout(() => { terminal.brightRed("  please enter an integer"); }, 0);

            return false;
        }

        return true;
    }

    isPositiveInteger(userInput) {

        if (parseInt(userInput) <= 0) {

            setTimeout(() => { terminal.brightRed("  please enter a postive integer"); }, 0);

            return false;
        }

        return true;
    }
}


module.exports = InquirerPrompts;