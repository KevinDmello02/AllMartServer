const Q = require('q');

const request = require('request'); 

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
