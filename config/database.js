const sqlite3 = require('sqlite3').verbose()
const {
    generatePasswordHash
} = require('../util/hashPassword');
const moment = require('moment-timezone');

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            username text UNIQUE, 
            password text, 
            balance DOUBLE,
            createdAt text,
            updatedAt text,
            CONSTRAINT username_unique UNIQUE (username));
            CREATE TABLE transaction (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            transactionTypeId INTEGER,
            transactionValue DOUBLE,
            transactionDesc text, 
            createdAt text, 
            updatedAt text);
            CREATE TABLE transactionType (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            transactionType text,
            isDeduct BOOLEAN
            createdAt text, 
            createdBy INTEGER, 
            updatedAt text,
            updatedBy INTEGER);`,
            async (err) => {
                if (err) {
                    // Table already created
                }else{
                    // Table just created, creating some rows
                    const insert = 'INSERT INTO user (name, username, password,balance,createdAt,updatedAt) VALUES (?,?,?,?,?,?)'
                    const password = await generatePasswordHash('@dminTest123');
                    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
                    db.run(insert, ["admin","admin@example.com",password,10000,createdAt,''])
                }
            });
    }
});


module.exports = db
