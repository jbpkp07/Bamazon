"use strict";
/* global module, require */

const creds = require('../../mysql_credentials.js');


class ConnectionDetails {

    constructor(database) {

        this.host = "localhost";
        this.port = 3306;
        this.user = creds.user;
        this.password = creds.pass;
        this.multipleStatements = true;

        if (typeof database !== 'undefined') {

            this.database = database;
        }
    }
}


module.exports = ConnectionDetails;