"use strict";
/* global require, module, exports */

const terminal = require("terminal-kit").terminal;


function printHeader() {

    terminal.reset();
    terminal.clear();
    terminal("\n");
    terminal.brightBlue(" ===============================================================================\n");
    terminal.brightCyan(" |                             Bamazon Store Front                             |\n");
    terminal.brightCyan(" |                                    v1.0                                     |\n");
    terminal.brightCyan(" |                          written by: Jeremy Barnes                          |\n");
    terminal.brightCyan(" |_____________________________________________________________________________|\n");
    terminal.brightCyan(" |                                                                             |\n");
    terminal.brightCyan(" | Usage       : ").white("node index.js").brightCyan("                                                 |\n");
    terminal.brightCyan(" |                                                                             |\n");
    terminal.brightCyan(" | Description : ").gray("Welcome to Bamazon, a virtual store front simulator!").brightCyan("          |\n");
    terminal.brightCyan(" |                                                                             |\n");
    terminal.brightCyan(" | Portals     : ").white("Customer   ->  ").gray("purchase products").brightCyan("                              |\n");
    terminal.brightCyan(" |               ").white("Manager    ->  ").gray("view/add products, view/add inventory").brightCyan("          |\n");
    terminal.brightCyan(" |               ").white("Supervisor ->  ").gray("view sales by department, add new department").brightCyan("   |\n");
    terminal.brightCyan(" |                                                                             |\n");
    terminal.brightBlue(" ===============================================================================");
    terminal("\n\n\n\n");
}

module.exports = printHeader;