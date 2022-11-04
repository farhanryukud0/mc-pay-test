const catchAsync = require('../util/catchAsync')
const {defaultResponse, failResponse, messageResponse} = require('../util/defaultResponse')
const db = require("../config/database.js")
const {generatePasswordHash} = require("../util/hashPassword");
const moment = require("moment-timezone");
const {StatusCodes} = require("http-status-codes");

const getUsers = catchAsync(async (req, res) => {
    const sql = "select * from user"
    const params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            return messageResponse(res, err.message);
        }
        return defaultResponse(res,rows);
    });
});

const createUser = catchAsync(async (req, res) => {
    const sql = 'INSERT INTO user (name, username, password,balance,createdAt,updatedAt) VALUES (?,?,?,?,?,?)'
    const param = req.body
    const password = await generatePasswordHash(param.password)
    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss")
    const params = [param.name,param.username,password,param.balance,createdAt,'']
    db.run(sql, params, (err, rows) => {
        if (err) {
            return messageResponse(res, err.message);
        }
        return messageResponse(res,'Data berhasil terinput',StatusCodes.OK);
    });
});

module.exports = {
    getUsers,
    createUser
};
