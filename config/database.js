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
        const createdAt = moment().format("YYYY-MM-DD HH:mm:ss")
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            username text UNIQUE, 
            password text, 
            createdAt text,
            updatedAt text,
            CONSTRAINT username_unique UNIQUE (username));`,
            async (err) => {
                if (err) {
                    // Table already created
                }else{
                    // Table just created, creating some rows
                    let insert = 'INSERT INTO user (name, username, password,createdAt,updatedAt) VALUES (?,?,?,?,?)'
                    const password = await generatePasswordHash('@dminTest123')
                    db.run(insert, ["admin","admin",password,createdAt,''])
                }
            });
        db.run(`CREATE TABLE transactionType (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            transactionType text,
            isDeduct BOOLEAN,
            createdAt text,
            updatedAt text);`,
            async (err) => {
                if (err) {
                    // Table already created
                }else{
                    // Table just created, creating some rows
                    let insert = 'insert into transactionType(transactionType,isDeduct,createdAt,updatedAt)  VALUES (?,?,?,?)'
                    db.run(insert, ['income',0,createdAt,''])
                    db.run(insert, ['expenses',1,createdAt,''])
                }
            });
        db.run(`CREATE TABLE transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            transactionTypeId INTEGER,
            transactionValue DOUBLE,
            transactionDesc text, 
            createdAt text, 
            updatedAt text);`,
            async (err) => {
                if (err) {
                    // Table already created
                }else{
                    let insert = 'insert into transactions(userId,transactionTypeId,transactionValue,transactionDesc,createdAt,updatedAt)  VALUES (?,?,?,?,?,?)'
                    db.run(insert, [1,1,10000,'Initial Balance',createdAt,''])
                }
            });
    }
});


module.exports = db
