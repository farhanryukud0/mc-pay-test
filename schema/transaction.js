const yup = require('yup');

const db = require("../config/database.js")

const insertTransactionSchema = yup.object({
    transactionTypeId: yup.number().required().test('test-transaction-type', 'Transaction Type not Found', function(value) {
        const sql = "select * from transactionType where id = ?"
        const params = [value]
        return new Promise((resolve) => {
            db.all(sql, params, (err, rows) => {
                if (err) {
                    resolve(false);
                }
                if(rows.length < 1) resolve(false);
                resolve(true);
            });
        })
    }),
    transactionDesc: yup.string().required().min(5, 'Minimal Description 5 character'),
    transactionValue: yup.number()
        .positive('balance must more than 0')
        .integer()
        .required(),
});

module.exports = {
    insertTransactionSchema
};
