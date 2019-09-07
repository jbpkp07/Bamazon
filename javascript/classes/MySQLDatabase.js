"use strict";
/* global require, module, process */

const terminal = require("terminal-kit").terminal;
const mysql2 = require('mysql2/promise');
const inquirer = require('inquirer');
const fs = require('fs');

const ConnectionDetails = require('./MySQLConnectionDetails.js');


class MySQLDatabase {

    constructor(host, port, multipleStatments, database, sqlDatabaseSeedFullPath) {

        this.host = host;
        this.port = port;
        this.multipleStatments = multipleStatments;
        this.database = database;
        this.sqlDatabaseSeedFullPath = sqlDatabaseSeedFullPath;
        this.connectionDetails = new ConnectionDetails(this.host, this.port, this.multipleStatments, this.database);

        this.isConnected = false;
        this.connectionID = null;
        this.connection = null;

        this.connectLock = false;
        this.disconnectLock = false;
    }

    connect() {

        if (this.connectLock) {

            const comment = `   Locked:  Already connecting to database [${this.database}]\n\n`;
            terminal.red(comment);
            return Promise.reject(comment);
        }

        if (this.isConnected) {

            const comment = `   Already connected to database [${this.database}] using connection id [${this.connectionID}]\n\n`;
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

            const comment = `   Locked:  Already disconnecting from database [${this.database}]\n\n`;
            terminal.red(comment);
            return Promise.reject(comment);
        }

        if (!this.isConnected) {

            const comment = `   No existing connection to database [${this.database}] to disconnect\n\n`;
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

    queryDatabase(query, placeholderArray) {

        const promise = this.connection.query(query, placeholderArray);

        return promise;
    }

    seedDatabaseOrExit(error) {

        const isDatabaseMissing = (error.errno === 1049 && error.sqlState === '42000');

        if (isDatabaseMissing) {

            terminal.red(`   Missing [`).white(`${this.database}`).red(`] database...\n\n`);

            const promise = this.promptToSeedDatabase();

            promise.then((answer) => {

                terminal("\n");

                if (answer.seedDB) {

                    this.seedDatabase();
                }
                else {

                    this.exit();
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
            message: ` Would you like to seed the [${this.database}] database`
        };

        const promise = inquirer.prompt([prompt]);

        return promise;
    }

    seedDatabase() {

        this.connectionDetails = new ConnectionDetails(this.host, this.port, this.multipleStatments);  //no database assigned, just connect to MySQL without specifying a database

        this.connectLock = false;

        this.connect().then(() => {

            const sqlSeed = fs.readFileSync(this.sqlDatabaseSeedFullPath).toString();

            terminal.gray(`   Seeding [`).white(`${this.database}`).gray(`] database...\n\n\n`);

            terminal.brightCyan(sqlSeed + "\n\n\n");

            this.queryDatabase(sqlSeed, []).then(() => {
                
                terminal.gray(`   Seeding [`).white(`${this.database}`).gray(`] database finished. Please restart this application.\n\n`);

            }).catch((error) => {
                
                terminal.red(`   Seeding [`).white(`${this.database}`).red(`] ${error}\n\n`);

            }).finally(() => {
               
                this.exit(); 
            });

        }).catch((error) => {

            this.exitAfterFailedConnection(error);
        });
    }

    exitAfterFailedConnection(error) {

        terminal.red(`   Unable to connect to database [`).white(`${this.database}`).red(`]\n\n`);
        terminal.red(`   ${error}\n\n`);

        this.exit();
    }

    exit() {

        terminal.hideCursor("");  //with ("") it shows the cursor
        process.exit(0);
    }
}


module.exports = MySQLDatabase;