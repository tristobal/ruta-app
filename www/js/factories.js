angular.module('ruta.factories', [])

.factory('LocalesFactory', function() {
    return {
        getAll: function() {
            var localesString = window.localStorage['locales'];
            if(localesString) {
                return angular.fromJson(localesString);
            } else {
                return [];
            }
        },
        add: function(local) {
            var localesString = window.localStorage['locales'];
            var locales = [];
            if(localesString) {
                locales = angular.fromJson(localesString);
            }
            local.id = locales.length + 1;
            locales.push(local);
            window.localStorage['locales'] = JSON.stringify(locales);
        },
        getById: function(id) {
            var localesString = window.localStorage['locales'];
            var locales = [];
            if(localesString) {
                locales = angular.fromJson(localesString);
            }

            for (var i = 0; i < locales.length; i++) {
                if (parseInt(id) === locales[i].id) {
                    return locales[i];
                }
            }

            //var pos = id - 1;
            //return locales[pos];
        },
        save: function(local) {
            var localesString = window.localStorage['locales'];
            var locales = [];
            if(localesString) {
                locales = angular.fromJson(localesString);
            }
            for (var i = 0; i < locales.length; i++) {
                if (local.id === locales[i].id) {
                    locales[i].lat = local.lat;
                    locales[i].long = local.long;
                    locales[i].nombre = local.nombre;
                    locales[i].location = local.location;
                    locales[i].marked = local.marked;
                    locales[i].notas = local.notas;
                }
            }
            window.localStorage['locales'] = JSON.stringify(locales);
        },
        delete: function(id) {
            var localesString = window.localStorage['locales'];
            var locales = [];
            if(localesString) {
                locales = angular.fromJson(localesString);
            }
            for (var i = 0; i < locales.length; i++) {
                if (parseInt(id) === locales[i].id) {
                    locales.splice(i,1);
                }
            }
            window.localStorage['locales'] = JSON.stringify(locales);
        }
    };
})

.factory('LoginFactory', function($http) {

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

})



;
