(function() {
    'use strict';

    angular
    .module('ruta.list', [])
    .controller('ListCtrl', listCtrl);

    listCtrl.$inject = ['$scope', 'LocalesFactory', '$state'];
    function listCtrl($scope, LocalesFactory, $state) {
        $scope.list = [];

        LocalesFactory.getAll()
        .success(function (data) {
            $scope.list = data;
        })
        .error(function (err) {
            console.log("Error = " + err);
        });

        $scope.seeDetail = function(input) {
            $state.go("app.detail",  {"listId" : input} );
        };
        $scope.mark = function(item) {
            item.marked = !item.marked;
            LocalesFactory.save(item);
        };
    }

})();
