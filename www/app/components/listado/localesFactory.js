(function() {
    'use strict';

    angular
    .module('ruta.localesfactory', [])
    .factory('LocalesFactory', localesFactory);

    localesFactory.$inject =  ['$http', 'RUTA_CONSTANTS'];
    function localesFactory($http, RUTA_CONSTANTS) {

        var service = {
            getAll : getAll,
            add : add,
            getById : getById,
            remove : remove,
            save : save
        };

        return service;

        function getAll() {
            return $http.get(RUTA_CONSTANTS.url_base + "/api/tasks/" + RUTA_CONSTANTS.id_list);
        }

        function add(local) {
            return $http.post(RUTA_CONSTANTS.url_base + "/api/task/", local);

            /*
            var localesString = window.localStorage['locales'];
            var locales = [];
            if(localesString) {
                locales = angular.fromJson(localesString);
            }
            local.id = locales.length + 1;
            locales.push(local);
            window.localStorage['locales'] = JSON.stringify(locales);
            */
        }

        function getById(id) {
            return $http.get(RUTA_CONSTANTS.url_base + "/api/task/" + id);
            /*
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
            */
        }

        function save(local) {
            var localesString = window.localStorage['locales'];
            var locales = [];
            if(localesString) {
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
            }
        }

        function remove(id) {
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

    }

})();
