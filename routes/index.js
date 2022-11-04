const createError = require('http-errors')
const express = require('express')
const router = express.Router()
const userRouter = require('./user');
const authRouter = require('./auth');


const defaultRoutes = [
    {path: '/user', route: userRouter},
    {path: '/auth', route: authRouter},
];

router.get('/', function (req, res) {
    res.send("Hello World");
});

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
module.exports = router;
