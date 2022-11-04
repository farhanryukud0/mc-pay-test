const express = require('express');
const router = express.Router();
const mw_validation = require('../middlewares/schemaValidation');
const { UserRegistrationSchema,userLoginSchema } = require('../schema/user');



const authController = require('../controller/auth');

router.post('/login', mw_validation(userLoginSchema), authController.login)


module.exports = router;
