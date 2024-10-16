const express = require('express');
const router = express.Router();

const currencyController = require('../controllers/currency.controller');

router.get('/',currencyController.list);


module.exports = router;