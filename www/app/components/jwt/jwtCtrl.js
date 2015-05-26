(function() {
    'use strict';

    angular
    .module('ruta.jwt', [])
    .controller('JWSCtrl', jwsCtrl);

    jwsCtrl.$inject =  ['$scope', 'LoginFactory', 'store', '$ionicLoading'];
    function jwsCtrl($scope, LoginFactory, store, $ionicLoading) {
        $scope.resultado = "";
        $scope.variables = {};

        $scope.loading = $ionicLoading.show({
            content: 'Consultando...',
            showBackdrop: false
        });

        $scope.variables.token = store.get('jwt');

        LoginFactory.getCertificate()
        .success(function (data) {
            $scope.variables.certificado = data.certificate;
            $ionicLoading.hide();
        })
        .error(function (error) {
            $ionicLoading.hide();
            alert("ERROR (al obtener certificado) = " + error );
        });

        //VERIFYING THE TOKEN
        $scope.verifyJWS = function(){

            var jws = new KJUR.jws.JWS();
            var sJWS = $scope.variables.token;
            var cer = $scope.variables.certificado;
            var result = jws.verifyJWSByPemX509Cert(sJWS, cer);
            $scope.resultado = result;
        };
    }
})();
