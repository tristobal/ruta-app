(function() {
    'use strict';

    angular
    .module('ruta.add', [])
    .controller('AddCtrl', addCtrl);

    addCtrl.$inject = ['$scope', 'LocalesFactory', '$state', 'RUTA_CONSTANTS', 'store', '$ionicLoading', 'SharedProperties'];
    function addCtrl($scope, LocalesFactory, $state, RUTA_CONSTANTS, store, $ionicLoading, SharedProperties) {
        $scope.local = {};

//liber bernardo o'higgins 58

        $scope.add = function() {

            $scope.loading = $ionicLoading.show({
                content: 'Guardando...',
                showBackdrop: false
            });

            $scope.local.id_user = SharedProperties.getIdUser();
            $scope.local.id_list = RUTA_CONSTANTS.id_list;
            $scope.local.lat = $scope.local.location.geometry.location.lat();
            $scope.local.long = $scope.local.location.geometry.location.lng();
            $scope.local.address =$scope.local.location.formatted_address;

            LocalesFactory.add($scope.local)
            .success(function (data) {
                alert("data\n" + data);
                $ionicLoading.hide();
                $state.go("app.list");
            })
            .error(function (error) {
                $ionicLoading.hide();
                alert("ERROR\n" + error);
            });





        };
    }

})();
