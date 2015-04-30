(function() {
    'use strict';

    angular
    .module('ruta.add', [])
    .controller('AddCtrl', addCtrl);

    addCtrl.$inject = ['$scope', 'LocalesFactory', '$state'];
    function addCtrl($scope, LocalesFactory, $state) {
        $scope.local = {};
        $scope.add = function() {
            $scope.local.lat = $scope.local.location.geometry.location.lat();
            $scope.local.long = $scope.local.location.geometry.location.lng();
            $scope.marked = false;
            LocalesFactory.add($scope.local);
            $state.go("app.list");
        };
    }

})();
