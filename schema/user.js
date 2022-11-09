const yup = require('yup');

const passwordRegExp = /[a-zA-Z]/;
const db = require("../config/database.js")

const UserRegistrationSchema = yup.object({
    name: yup.string().required().min(8, 'Minimal name with 8 character'),
    username: yup.string().required().test('test-username', 'Username already used', function(value) {
        const sql = "select * from user where username = ?"
        const params = [value]
        return new Promise((resolve) => {
            db.all(sql, params, (err, rows) => {
                if (err) {
                    resolve(false);
                }
                if(rows.length > 0) resolve(false);
                resolve(true);
            });
        })
    }),
    password: yup.string().required().min(8, 'Minimal password 8 character').matches(passwordRegExp, 'Password not valid'),
    password_confirmation: yup.string().required().oneOf([yup.ref('password'), null], 'Password doesnt match'),
    balance: yup.number()
        .positive('balance must more than 0')
        .integer()
        .required(),
});

const UserUpdateSchema = yup.object({
    id:yup.number().required().test('test-user-id', 'ID not found', function(value) {
        const sql = "select * from user where id = ?"
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
    name: yup.string().required().min(8, 'Minimal name with 8 character'),
    username: yup.string().required().test('test-username', 'Username already used', function(value) {
        const sql = "select * from user where username = ? and id != ?"
        const params = [value,this.parent.id]
        return new Promise((resolve) => {
            db.all(sql, params, (err, rows) => {
                if (err) {
                    resolve(false);
                }
                if(rows.length > 0) resolve(false);
                resolve(true);
            });
        })
    }),
    password: yup.string().required().min(8, 'Minimal password 8 character').matches(passwordRegExp, 'Password not valid')
});
const userLoginSchema = yup.object({
    username: yup.string().required(),
    password: yup.string().required(),
});



module.exports = {
    UserRegistrationSchema,
    UserUpdateSchema,
    userLoginSchema,
};
