"use strict";
/* global require, module, exports */

const terminal = require("terminal-kit").terminal;
const Table = require('cli-table');


function printTable(rows, fields, colAligns) {

    const tableHeaders = [];
    const tableData = [];
    let compact = false;

    fields.forEach(field => tableHeaders.push(field.name));

    for (const row of rows) {

        const tableRow = [];

        if (row.price) {

            row.price = "$" + row.price;  //Add $ to the front of price
        }

        Object.values(row).forEach(value => tableRow.push(value));

        tableData.push(tableRow);
    }

    if (tableData.length > 10) {

        compact = true;
    }

    const tableConfigOBJ =
    {
        head: tableHeaders,
        // colWidths: [38, 38],                              //specify static column width (without this line it will auto-fit)
        // colAligns: ['left', 'right', 'middle', ..... ],    //specify column alignments, using 'left', 'right', 'middle' for each column
        colAligns: colAligns,
        style: { 'padding-left': 1, 'padding-right': 1, head: ['cyan'], border: ['gray'], compact: compact }
    };

    const table = new Table(tableConfigOBJ);

    tableData.forEach(tableRow => table.push(tableRow));

    const tableSTR = table.toString();

    const tableSTRIndented = " " + tableSTR.replace(/\n/g, "\n ") + "\n\n";

    terminal(tableSTRIndented);
}

function printProductsTable(rows, fields) {

    const colAligns = ['right', 'left', 'left', 'right', 'right'];

    printTable(rows, fields, colAligns);
}


module.exports = {

    printProductsTable: printProductsTable
};