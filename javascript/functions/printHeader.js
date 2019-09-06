"use strict";
/* global require, module, exports */

const terminal = require("terminal-kit").terminal;
const Table = require('cli-table');

function printHeader() {

    terminal.reset();
    terminal.clear();
    terminal("\n");
    terminal.brightBlue(" ┌─────────────────────────────────────────────────────────────────────────────┐\n");
    terminal.brightBlue(" │").brightCyan("                             Bamazon Store Front                             ").brightBlue("│\n");
    terminal.brightBlue(" │").brightCyan("                                    v1.0                                     ").brightBlue("│\n");
    terminal.brightBlue(" │").brightCyan("                          written by: Jeremy Barnes                          ").brightBlue("│\n");
    terminal.brightBlue(" ├─────────────────────────────────────────────────────────────────────────────┤\n");
    terminal.brightBlue(" │                                                                             │\n");
    terminal.brightBlue(" │").brightCyan(" Usage       : ").white("node index.js").brightBlue("                                                 │\n");
    terminal.brightBlue(" │                                                                             │\n");
    terminal.brightBlue(" │").brightCyan(" Description : ").gray("Welcome to Bamazon, a virtual store front simulator!").brightBlue("          │\n");
    terminal.brightBlue(" │                                                                             │\n");
    terminal.brightBlue(" │").brightCyan(" Portals     : ").white("Customer   ->  ").gray("purchase products").brightBlue("                              │\n");
    terminal.brightBlue(" │").white("               Manager    ->  ").gray("view/add products, view/add inventory").brightBlue("          │\n");
    terminal.brightBlue(" │").white("               Supervisor ->  ").gray("view sales by department, add new department").brightBlue("   │\n");
    terminal.brightBlue(" │                                                                             │\n");
    terminal.brightBlue(" └─────────────────────────────────────────────────────────────────────────────┘");
    terminal("\n\n\n");


    

    // instantiate
    var table = new Table({
        head: ['TH 1 label', 'TH 2 label'],
        colWidths: [38, 38],
        colAligns: ['middle', 'middle'],
        style: { head: ['cyan'], border: ['gray'], compact: true }
    });


    // table is an Array, so you can `push`, `unshift`, `splice` and friends
    table.push(
        ['First value', 'Second value'],
        ['First value', 'Second value']
    );



    const results = table.toString();
  
    const resultsIndented = " " + results.replace(/\n/g, "\n ") + "\n\n";

    terminal.brightCyan(resultsIndented);
}

module.exports = printHeader;