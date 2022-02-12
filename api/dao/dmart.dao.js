const Q = require('q');

const request = require('request');

exports.getProductDetails = function (body) {
    var deferred = Q.defer();
    console.log('inside getProductDetails service');

    request.get({
        headers: { 'Access-Control-Allow-Origin': '*'},
        url: `https://digital.dmart.in/api/v1/search/${body.searchKey}?page=1&size=40`
    }, function(error, response, body){
        if (error) {
            deferred.resolve({ message: 'Error getProductDetails Dmart' });
        } else {
            deferred.resolve(body);
        }
    });

    return deferred.promise;
}