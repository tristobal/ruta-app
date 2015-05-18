(function() {
    'use strict';

    angular
    .module('ruta.profilefactory', [])
    .factory('ProfileFactory', profileFactory);

    profileFactory.$inject =  ['$http', 'RUTA_CONSTANTS'];
    function profileFactory($http, RUTA_CONSTANTS) {

        var service = {
            updateProfile : updateProfile
        };
        return service;

        function updateProfile(json) {
            return $http.post(RUTA_CONSTANTS.url_base + "/token", json);
        }
    }
})();
