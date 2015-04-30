(function() {
    'use strict';

    angular
    .module('ruta.loginfactory', [])
    .factory('LoginFactory', loginFactory);

    loginFactory.$inject =  ['$http'];
    function loginFactory($http) {
        //var urlBase = "http://localhost:5000";
        var urlBase = "https://rodotrans-rest.herokuapp.com";

        var service = {
            getToken : getToken,
            getCertificate : getCertificate
        };

        return service;

        function getToken(json) {
            return $http.post(urlBase + "/token", json);
        }

        function getCertificate() {
            return $http.get("http://localhost:3000/public/certificate");
        }
    }
})();
