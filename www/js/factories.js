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
        save: function(local) {
            var localesString = window.localStorage['locales'];
            var locales = [];
            if(localesString) {
                locales = angular.fromJson(localesString);W
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
            var pos = id - 1;
            return locales[pos];
        }
    };
});
