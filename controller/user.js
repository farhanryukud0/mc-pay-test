const catchAsync = require('../util/catchAsync')
const {defaultResponse, failResponse, messageResponse} = require('../util/defaultResponse')
const db = require("../config/database.js")
const {generatePasswordHash} = require("../util/hashPassword")
const moment = require("moment-timezone")
const {StatusCodes} = require("http-status-codes")

const getUsers = catchAsync(async (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint para obter um usuário.'
    const sql = "select * from user"
    const params = []
    db.all(sql, params, function (err, rows) {
        if (err) {
            return messageResponse(res, err.message)
        }
        return defaultResponse(res,rows)
    })
})

const createUser = catchAsync(async (req, res) => {
    let sql = 'INSERT INTO user (name, username, password,createdAt,updatedAt) VALUES (?,?,?,?,?)'
    const param = req.body
    const password = await generatePasswordHash(param.password)
    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss")
    let params = [param.name,param.username,password,createdAt,'']
    db.run('begin transaction')
    db.run(sql, params, function (err, row) {
        if (err) {
            db.run('rollback')
            return messageResponse(res, err.message)
        }
        sql = 'INSERT INTO transactions (userId,transactionTypeId,transactionValue,transactionDesc,createdAt,updatedAt)  VALUES (?,?,?,?,?,?)'
        params = [this.lastID,1,param.balance,'Initial Balance',createdAt,'']
        db.run(sql, params, function (err, row) {
            if (err) {
                db.run('rollback')
                return messageResponse(res, err.message)
            }
            db.run('commit')
            return messageResponse(res,'Data berhasil terinput',StatusCodes.OK)
        })
    })
})

const updateUser = catchAsync(async (req, res) => {
    let sql = 'update user set name = ?, username = ?, password = ?,updatedAt = ? where id = ?'
    const param = req.body
    const password = await generatePasswordHash(param.password)
    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss")
    let params = [param.name,param.username,password,createdAt,param.id]
    db.run(sql, params, function (err, row) {
        if (err) {
            return messageResponse(res, err.message)
        }
        return messageResponse(res,'Data berhasil diupdate',StatusCodes.OK)
    })
})

module.exports = {
    getUsers,
    createUser,
    updateUser
}
