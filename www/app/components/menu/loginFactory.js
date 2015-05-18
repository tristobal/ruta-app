(function() {
    'use strict';

    angular
    .module('ruta.loginfactory', [])
    .factory('LoginFactory', loginFactory);

    loginFactory.$inject =  ['$http', 'RUTA_CONSTANTS'];
    function loginFactory($http, RUTA_CONSTANTS) {

        var service = {
            getToken : getToken,
            getCertificate : getCertificate
        };

        return service;

        function getToken(json) {
            return $http.post(RUTA_CONSTANTS.url_base + "/public/token", json);
        }

        function getCertificate() {
            return $http.get(RUTA_CONSTANTS.url_base + "/public/certificate");
        }
    }
})();
