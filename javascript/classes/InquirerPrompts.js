"use strict";
/* global require, module, process */

const terminal = require("terminal-kit").terminal;
const inquirer = require('inquirer');


class InquirerPrompts {

    constructor() {

        this.listPromptLength = null;

        // this.areListenersOn = false;

        process.stdin.on('keypress', this.tidyListPrompt.bind(this));
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

        // this.areListenersOn = true;

        const promise = inquirer.prompt(promptOBJ);

        this.tidyListPromptMessage(this.listPromptLength);
  
        promise.then((choice) => {

            // this.areListenersOn = false;

            // process.stdin.off('keypress', this.tidyListPrompt.bind(this));
   
            terminal.cyan("   " + choice[name].trim());
          
        });

        return promise;
    }

    tidyListPrompt(str, key) {
        
        // if (!this.areListenersOn) {

        //     return;
        // }

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
}


module.exports = InquirerPrompts;