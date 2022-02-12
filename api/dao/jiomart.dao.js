const Q = require('q');

const request = require('request');

exports.getProductDetails = function (jioMartBody) {
    var deferred = Q.defer();
    console.log('inside getProductDetails service');

    request.post({
        headers: { 'Access-Control-Allow-Origin': '*'},
        url: 'https://3yp0hp3wsh-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(3.33.0)%3B%20Browser%3B%20instantsearch.js%20(4.33.2)%3B%20JS%20Helper%20(3.6.2)&x-algolia-application-id=3YP0HP3WSH&x-algolia-api-key=aace3f18430a49e185d2c1111602e4b1',
        json: jioMartBody
      }, function(error, response, body){
        if (error) {
            deferred.resolve({ message: 'Error getProductDetails Jiomart' });
        } else {
            deferred.resolve(body);
        }
      });
    
    return deferred.promise;
}