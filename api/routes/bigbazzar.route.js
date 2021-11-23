const express = require('express');
const { bigbazzarController } = require('../controllers/index');

const bigbazzarRoutes = express.Router({});

bigbazzarRoutes.post('/getProductDetails', bigbazzarController.getProductDetails);


module.exports = bigbazzarRoutes;