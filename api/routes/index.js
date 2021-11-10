const express = require('express');
const apiRoutes = express.Router();

const dmartRoutes = require('./dmart.route');
const jiomartRoutes = require('./jiomart.route');

apiRoutes.use('/api/scrape/dmartProducts', dmartRoutes);
apiRoutes.use('/api/scrape/jiomartProducts', jiomartRoutes);

module.exports = apiRoutes;