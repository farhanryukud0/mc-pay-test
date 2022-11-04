const createError = require('http-errors')
const express = require('express')
const router = express.Router()
const userRouter = require('./user.route');


const defaultRoutes = [
    {path: '/user', route: userRouter},
];

router.get('/', function (req, res) {
    res.send("Hello World");
});

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
module.exports = router;
