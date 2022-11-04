const createError = require('http-errors')
const express = require('express')
const router = express.Router()
const db = require("../config/database.js")

router.get('/', function (req, res) {
    res.send("Hello World");
});

router.get("/api/users", (req, res, next) => {
    const sql = "select * from user"
    const params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});
module.exports = router;
