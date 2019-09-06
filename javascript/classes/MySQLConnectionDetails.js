"use strict";
/* global module, require */

const creds = require('../../mysql_credentials.js');
const Utility = require('./Utility.js');


class MySQLConnectionDetails {

    constructor(host, port, multipleStatments, database) {

        this.validateArguments(host, port, multipleStatments, creds);

        this.host = host;
        this.port = port;
        this.user = creds.user;
        this.password = creds.pass;
        this.multipleStatements = multipleStatments;

        if (typeof database !== 'undefined') {

            this.database = database;
        }
    }

    validateArguments(host, port, multipleStatments, creds) {

        if (!Utility.isStr(host) || !Utility.isNum(port) || !Utility.isBool(multipleStatments) || !Utility.isStr(creds.user) || !Utility.isStr(creds.pass)) {

            throw new Error("MySQLConnectionDetails.validateArguments  was not supplied with valid arguments.");
        }
    }
}


module.exports = MySQLConnectionDetails;