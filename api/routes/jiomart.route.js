const express = require('express');
const { jiomartController } = require('../controllers/index');

const jiomartRoutes = express.Router({});

jiomartRoutes.post('/getProductDetails', jiomartController.getProductDetails);


module.exports = jiomartRoutes;