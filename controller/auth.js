const catchAsync = require('../util/catchAsync')
const {defaultResponse, messageResponse} = require('../util/defaultResponse')
const db = require("../config/database.js")
const {comparePasswordHash} = require("../util/hashPassword")
const {StatusCodes} = require("http-status-codes")
const {createAuthToken} = require("../util/accessToken");

const login = catchAsync(async (req, res) => {
    const sql = "select * from user where username = ?"
    const params = [req.body.username]
    db.get(sql, params, async function (err, row) {
        if (err) {
            return messageResponse(res, err.message)
        }
        if (!row) return messageResponse(res, 'User not found')
        const isMatch = await comparePasswordHash(req.body.password, row.password);
        if (!isMatch) return messageResponse(res, 'Wrong Password')
        const token = await createAuthToken(row);
        return defaultResponse(res,token)
    })
})

module.exports = {
    login,
}
