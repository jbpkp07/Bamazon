"use strict";
/* global require, module */

const terminal = require("terminal-kit").terminal;


const xCoord = 1;
const yCoord = 20;

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
    terminal("\n\n");
}

function clearScreenBelowHeader() {

    terminal.moveTo(xCoord, yCoord);

    terminal.eraseDisplayBelow();
}

module.exports = 
{
    printHeader: printHeader,
    clearScreenBelowHeader: clearScreenBelowHeader
};