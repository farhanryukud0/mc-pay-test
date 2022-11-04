const catchAsync = require('../util/catchAsync')
const {defaultResponse, failResponse, messageResponse} = require('../util/defaultResponse')
const db = require("../config/database.js")
const {generatePasswordHash} = require("../util/hashPassword")
const moment = require("moment-timezone")
const {StatusCodes} = require("http-status-codes")
const httpContext = require('express-http-context');


const getAll = catchAsync(async (req, res) => {
    const sql = `select trx.id,tt.transactionType,
                CASE when tt.isDeduct = 1 THEN 'DEBIT' ELSE 'CREDIT' END 'debit/credit',
                trx.transactionValue,
                trx.transactionDesc,
                trx.createdAt 
                from transactions trx join transactionType tt on trx.transactionTypeId = tt.id 
                where userId = ? order by trx.createdAt desc`
    const userId = httpContext.get('userId');
    const params = [userId]
    db.all(sql, params, function (err, rows) {
        if (err) {
            return messageResponse(res, err.message)
        }
        if(rows.length < 1) return messageResponse(res,'Transaksi tidak di temukan',StatusCodes.NOT_FOUND)

        return defaultResponse(res,rows)
    })
})

const getById = catchAsync(async (req, res) => {
    const sql = `select trx.id,tt.transactionType,
                CASE when tt.isDeduct = 1 THEN 'DEBIT' ELSE 'CREDIT' END 'debit/credit',
                trx.transactionValue,
                trx.transactionDesc,
                trx.createdAt 
                from transactions trx join transactionType tt on trx.transactionTypeId = tt.id 
                where userId = ? and trx.id = ?`
    const userId = httpContext.get('userId');
    const params = [userId,req.params.id]
    db.get(sql, params, function (err, row) {
        if (err) {
            return messageResponse(res, err.message)
        }
        if(!row) return messageResponse(res,'Transaksi tidak di temukan',StatusCodes.NOT_FOUND)

        return defaultResponse(res,row)
    })
})

const deleteById = catchAsync(async (req, res) => {
    const sql = "delete from transactions where userId = ? and id = ?"
    const userId = httpContext.get('userId');
    const params = [userId,req.params.id]
    db.get(sql, params, function (err, row) {
        if (err) {
            return messageResponse(res, err.message)
        }
        return messageResponse(res,'Data Transaksi berhasil di delete',StatusCodes.OK)
    })
})

const createTransaction = catchAsync(async (req, res) => {
    const userId = httpContext.get('userId');
    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss")
    if(req.body.transactionTypeId == 2){
        const balanceLeft = await getUserBalance()
        if((balanceLeft.balance-req.body.transactionValue) < 0) return messageResponse(res, 'Saldo tidak cukup')
    }

    const insert = 'insert into transactions(userId,transactionTypeId,transactionValue,transactionDesc,createdAt,updatedAt)  VALUES (?,?,?,?,?,?)'
    const params = [userId,req.body.transactionTypeId,
        req.body.transactionValue,
        req.body.transactionDesc,
        createdAt,'']
    db.run(insert, params, function (err, row) {
        if (err) {
            return messageResponse(res, err.message)
        }
        return messageResponse(res,'Data Transaksi berhasil terinput',StatusCodes.OK)
    })
})

const updateTransaction = catchAsync(async (req, res) => {
    const userId = httpContext.get('userId');
    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss")
    if(req.body.transactionTypeId == 2){
        const balanceLeft = await getUserBalance(req.params.id)
        if((balanceLeft.balance-req.body.transactionValue) < 0) return messageResponse(res, 'Saldo tidak cukup')
    }

    const update = 'update transactions set transactionTypeId = ?, transactionValue = ?, transactionDesc = ? ,updatedAt = ? where id = ? and userId = ?'
    const params = [req.body.transactionTypeId,
        req.body.transactionValue,
        req.body.transactionDesc,
        createdAt,req.params.id,userId]
    db.run(update, params, function (err, row) {
        if (err) {
            return messageResponse(res, err.message)
        }
        return messageResponse(res,'Data Transaksi berhasil diupdate',StatusCodes.OK)
    })
})

const getUserBalance = async (id = null) => {
    return new Promise(resolve => {
        let sql = "select SUM(CASE WHEN transactionTypeId = 1 THEN transactionValue ELSE -transactionValue END) balance from transactions where userId = ?"

        const userId = httpContext.get('userId');
        const params = [userId]
        if(id){
            sql+= ' and id != ?';
            params.push(id);
        }
        db.get(sql, params, function (err, row) {
            if (err) throw err
            resolve(row)
        })
    })
}

module.exports = {
    getAll,
    getById,
    deleteById,
    createTransaction,
    updateTransaction,
}
