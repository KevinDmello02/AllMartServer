const bigbazzarService = require('../services/bigbazzar.service');

function getProductDetails(req, res, next) {
	console.log('inside getProductDetails controller');
	bigbazzarService.getProductDetails(req.body).then(function(response) {
		res.send(response);
	})
}

module.exports = {
	getProductDetails
}