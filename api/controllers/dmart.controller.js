const dmartService = require('../services/dmart.service');

function getProductDetails(req, res, next) {
	console.log('inside getProductDetails controller');
	dmartService.getProductDetails(req.body).then(function(response) {
		res.send(response);
	})
}

module.exports = {
	getProductDetails
}