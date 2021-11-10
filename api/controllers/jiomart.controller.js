const jiomartService = require('../services/jiomart.service');

function getProductDetails(req, res, next) {
	console.log('inside getProductDetails controller');
	jiomartService.getProductDetails(req.body).then(function(response) {
		res.send(response);
	})
}

module.exports = {
	getProductDetails
}