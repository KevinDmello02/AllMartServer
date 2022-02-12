const Q = require('q');

const jiomartDao = require('../dao/jiomart.dao'); 

exports.getProductDetails = async function (body) {
	var deferred = Q.defer();
    console.log('inside getProductDetails service');

    let jioMartBody = {
        "requests": [
            {
                "indexName": "prod_mart_master_vertical",
                "params": "query=" + body.searchKey
            }
        ]
    }

    jiomartDao.getProductDetails(jioMartBody).then(function (result) {
        console.log(result);

        if (result) {
            deferred.resolve(result);
        } else {
            deferred.resolve({ 'Error': 'Error while fetching data'})
        }
    })
    
    return deferred.promise;
}