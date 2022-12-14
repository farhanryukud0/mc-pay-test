const express = require('express');
const router = express.Router();
const mw_validation = require('../middlewares/schemaValidation');
const { UserRegistrationSchema } = require('../schema/user');



const userController = require('../controller/user');

router.get('/', userController.getUsers);
router.put('/', mw_validation(UserRegistrationSchema), userController.createUser)


module.exports = router;
