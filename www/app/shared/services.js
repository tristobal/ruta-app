angular.module('ruta.services', [])

.service('SharedProperties', function () {
    var idUser = 0;
    var tokenExpiration = 0;
    var local = {};

    return {
        getLocal: function () {
            return local;
        },
        setLocal: function(value) {
            local = value;
        },
        getIdUser: function() {
            return idUser;
        },
        setIdUser: function(value) {
            idUser = value;
        },
        getTokenExpiration: function() {
            return tokenExpiration;
        },
        setTokenExpiration: function(value) {
            tokenExpiration = parseInt(value);
        }
    };
});
