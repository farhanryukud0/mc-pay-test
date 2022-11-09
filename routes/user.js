const express = require('express');
const router = express.Router();
const mw_validation = require('../middlewares/schemaValidation');
const { UserRegistrationSchema, UserUpdateSchema} = require('../schema/user');



const userController = require('../controller/user');

router.get('/', userController.getUsers);
router.post('/', mw_validation(UserRegistrationSchema), userController.createUser)
router.put('/', mw_validation(UserUpdateSchema), userController.updateUser)


module.exports = router;
