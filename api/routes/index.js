const express = require('express');
const apiRoutes = express.Router();

const dmartRoutes = require('./dmart.route');
const jiomartRoutes = require('./jiomart.route');
const bigbazzarRoutes = require('./bigbazzar.route');

apiRoutes.use('/api/ping', function(res, res) {
    console.log('Ping!');
    res.send('Ping!');
})
apiRoutes.use('/api/dmartProducts', dmartRoutes);
apiRoutes.use('/api/jiomartProducts', jiomartRoutes);
apiRoutes.use('/api/bigbazzarProducts', bigbazzarRoutes);

module.exports = apiRoutes;