const express = require('express');
const { dmartController } = require('../controllers/index');

const dmartRoutes = express.Router({});

dmartRoutes.post('/getProductDetails', dmartController.getProductDetails);


module.exports = dmartRoutes;