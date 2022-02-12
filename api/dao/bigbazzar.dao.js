const Q = require('q');

const request = require('request');

exports.getProductDetails = async function (bigBazzarBody) {
    var deferred = Q.defer();
    console.log('inside getProductDetails service');

    await request.post({
        headers: { 'Access-Control-Allow-Origin': '*'},
        url: 'https://express.shop.bigbazaar.com/express/product/search/lite',
        json: bigBazzarBody
      }, function(error, response, body) {
        if (error) {
            deferred.resolve({ message: 'Error getProductDetails Bigbazzar' });
        } else {
            deferred.resolve(body.responseData.results);
        }
      });
    
    return deferred.promise;
}