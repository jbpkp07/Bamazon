"use strict";
/* global require, module, process, __dirname */

const terminal = require("terminal-kit").terminal;
const mysql2 = require('mysql2/promise');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

const ConnectionDetails = require('./ConnectionDetails.js');


class BamazonDatabase {

    constructor() {

        this.db = 'bamazon';
        this.connectionDetails = new ConnectionDetails(this.db);

        this.isConnected = false;
        this.connectionID = null;
        this.connection = null;

        this.connectLock = false;
        this.disconnectLock = false;
    }

    connect() {

        if (this.connectLock) {

            const comment = `   Locked:  Already connecting to database [${this.db}]\n\n`;
            terminal.red(comment);
            return Promise.reject(comment);
        }

        if (this.isConnected) {

            const comment = `   Already connected to database [${this.db}] using connection id [${this.connectionID}]\n\n`;
            terminal.red(comment);
            return Promise.reject(comment);
        }

        this.connectLock = true;

        const promise = mysql2.createConnection(this.connectionDetails);

        promise.then((newConnection) => {

            this.connectionID = newConnection.connection._handshakePacket.connectionId;
            this.connection = newConnection;
            this.isConnected = true;
            this.connectLock = false;

            terminal.gray(`   Connected to database [`).white(`${this.connection.config.database}`).gray(`] using connection id [`).white(`${this.connectionID}`).gray(`]\n\n`);

        }).catch((error) => {

            this.seedDatabaseOrExit(error);
        });

        return promise;
    }

    disconnect() {

        if (this.disconnectLock) {

            const comment = `   Locked:  Already disconnecting from database [${this.db}]\n\n`;
            terminal.red(comment);
            return Promise.reject(comment);
        }

        if (!this.isConnected) {

            const comment = `   No existing connection to database [${this.db}] to disconnect\n\n`;
            terminal.red(comment);
            return Promise.reject(comment);
        }

        this.disconnectLock = true;

        const promise = this.connection.end();

        promise.then(() => {

            terminal.gray(`   Disconnected from database [`).white(`${this.connection.config.database}`).gray(`] dropping connection id [`).white(`${this.connectionID}`).gray(`]\n\n`);

            this.connectionID = null;
            this.connection = null;
            this.isConnected = false;
            this.disconnectLock = false;
        });

        return promise;
    }

    seedDatabaseOrExit(error) {

        const isBamazonDBMissing = (error.errno === 1049 && error.sqlState === '42000');

        if (isBamazonDBMissing) {

            terminal.red(`   Missing [`).white(`${this.db}`).red(`] database...\n\n`);

            const promise = this.promptToSeedDatabase();

            promise.then((answer) => {

                terminal("\n");

                if (answer.seedDB) {

                    this.seedDatabase();
                }
            });
        }
        else {

            this.exitAfterFailedConnection(error);
        }
    }

    promptToSeedDatabase() {

        const prompt =
        {
            name: "seedDB",
            type: "confirm",
            default: false,
            message: ` Would you like to seed the [${this.db}] database`
        };

        const promise = inquirer.prompt([prompt]);

        return promise;
    }

    seedDatabase() {

        this.connectionDetails = new ConnectionDetails();  //no database assigned, just connect to MySQL without specifying a database

        this.connectLock = false;

        this.connect().then(() => {

            const bamazonSeedSQLPath = path.join(__dirname, '../../sql/BamazonSeed.sql');

            const sqlSeed = fs.readFileSync(bamazonSeedSQLPath).toString();

            terminal.gray(`   Seeding [`).white(`${this.db}`).gray(`] database...\n\n\n`);

            terminal.brightCyan(sqlSeed + "\n\n\n");

            this.queryDatabase(sqlSeed, []).then(() => {
                
                terminal.gray(`   Seeding [`).white(`${this.db}`).gray(`] database finished. Please restart this application.\n\n`);

            }).catch((error) => {
                
                terminal.red(`   ${error}\n\n`);

            }).finally(() => {
               
                process.exit(0); 
            });

        }).catch((error) => {

            this.exitAfterFailedConnection(error);
        });
    }

    queryDatabase(query, placeholderArray) {

        const promise = this.connection.query(query, placeholderArray);

        return promise;
    }

    exitAfterFailedConnection(error) {

        terminal.red(`   Unable to connect to database [`).white(`${this.db}`).red(`]\n\n`);
        terminal.red(`   ${error}\n\n`);

        process.exit(0);
    }
}


module.exports = BamazonDatabase;