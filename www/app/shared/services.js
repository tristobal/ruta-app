angular.module('ruta.services', [])

.service('SharedProperties', function () {
    var idLocal = 0;

    return {
        getIdLocal: function () {
            return idLocal;
        },
        setIdLocal: function(value) {
            idLocal = value;
        }
    };
});
