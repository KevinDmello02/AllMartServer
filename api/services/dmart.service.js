const Q = require('q');

const dmartDao = require('../dao/dmart.dao');

exports.getProductDetails = async function (body) {
	var deferred = Q.defer();
    console.log('inside getProductDetails service');

    dmartDao.getProductDetails(body).then(function (result) {
        console.log(result);

        if (result) {
            deferred.resolve(result);
        } else {
            deferred.resolve({ 'Error': 'Error while fetching data' });
        }
        
    });
    
    return deferred.promise;
}