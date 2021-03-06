"use strict";
/* global require, module */

const terminal = require("terminal-kit").terminal;
const Table = require('cli-table');


function printTable(tableHeaders, tableData, colAligns) {

    let compact = false;

    if (tableData.length > 10) {

        compact = true;
    }

    const tableConfigOBJ =
    {
        head: tableHeaders,
        // colWidths: [38, 38],                               //specify static column width (without this line it will auto-fit)
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

    const tableHeaders = [];
    const tableData = [];
    const colAligns = ['right', 'left', 'left', 'right', 'right', 'right'];

    fields.forEach(field => tableHeaders.push(field.name));

    for (const row of rows) {

        const tableRow = [];

        Object.keys(row).forEach(key => {

            if (key === 'price' || key === 'sales') {

                const preparedCurrencySTR = "$" + row[key].toFixed(2);

                tableRow.push(preparedCurrencySTR);  //Add $ to the front of price, and fix 2 decimal places
            }
            else {

                tableRow.push(row[key]);
            }
        });

        tableData.push(tableRow);
    }

    printTable(tableHeaders, tableData, colAligns);
}

function printDepartmentsTable(rows, fields) {

    const tableHeaders = [];
    const tableData = [];
    const colAligns = ['right', 'left', 'right', 'right', 'right'];

    fields.forEach(field => tableHeaders.push(field.name));

    for (const row of rows) {

        const tableRow = [];

        Object.keys(row).forEach(key => {

            if (key === 'overhead' || key === 'sales' || key === 'profit') {
    
                let preparedCurrencySTR = row[key].toFixed(2);

                if (preparedCurrencySTR[0] !== "-") {

                    preparedCurrencySTR = "$" + preparedCurrencySTR;
                }
                else {

                    preparedCurrencySTR = "-$" +  preparedCurrencySTR.substring(1);
                }

                tableRow.push(preparedCurrencySTR);  //Add $ to the front of overhead/sales/profit, and fix 2 decimal places
            }
            else {

                tableRow.push(row[key]);
            }
        });

        tableData.push(tableRow);
    }

    printTable(tableHeaders, tableData, colAligns);
}

module.exports = 
{
    printProductsTable: printProductsTable,
    printDepartmentsTable: printDepartmentsTable
};