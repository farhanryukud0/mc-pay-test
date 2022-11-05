const express = require('express');
const router = express.Router();
const mw_validation = require('../middlewares/schemaValidation');
const { insertTransactionSchema } = require('../schema/transaction');



const transactionController = require('../controller/transaction');
const {verifyToken} = require("../middlewares/authJwt");

router.get('/', verifyToken,  transactionController.getAll)
router.get('/summary', verifyToken,  transactionController.getSummary)
router.get('/:id', verifyToken,  transactionController.getById)
router.delete('/:id', verifyToken,  transactionController.deleteById)
router.put('/', [mw_validation(insertTransactionSchema),verifyToken],  transactionController.createTransaction)
router.put('/:id', [mw_validation(insertTransactionSchema),verifyToken],  transactionController.updateTransaction)


module.exports = router;
