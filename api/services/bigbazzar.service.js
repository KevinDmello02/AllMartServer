const Q = require('q');

const request = require('request');
const bigbazaarDao = require('../dao/bigbazzar.dao');

exports.getProductDetails = async function (body) {
	var deferred = Q.defer();
    console.log('inside getProductDetails service');
    // console.log(body.searchKey);
    // let searchResults = await scrapeData(body.searchKey);

    let bigBazzarBody = {
        "filters": [],
        "pageNo": "1",
        "perPage": "16",
        "searchTerm": body.searchKey,
        "storeCode": "5538"
    }

    bigbazaarDao.getProductDetails(bigBazzarBody).then(function (result) {
        console.log(result);
        
        if (result) {
            // deferred.resolve(result);
            
            let transformedData = [];

            result.forEach(element => {
                let obj = {
                    product_name: element.name + ' - ' + element.name,
                    image: element.images,
                    skus: element.simples
                }

                transformedData.push(obj);
            });

            deferred.resolve(transformedData);

        } else {
            deferred.resolve({ 'Error': 'Error while fetching data.' })
        }
    });
    
    return deferred.promise;
}
