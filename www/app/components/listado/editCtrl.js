(function() {
    'use strict';

    angular
    .module('ruta.edit', [])
    .controller('EditCtrl', editCtrl);

    editCtrl.$inject = ['$scope', 'LocalesFactory', '$state', '$stateParams', '$ionicHistory', '$ionicPopup'];
    function editCtrl($scope, LocalesFactory, $state, $stateParams, $ionicHistory, $ionicPopup) {
        $scope.local = {};
        var listid = $stateParams.listId;
        $scope.local = LocalesFactory.getById( listid );
        $scope.map = {
            center: {
                latitude: $scope.local.lat,
                longitude: $scope.local.long
            },
            zoom: 16,
            bounds: {}
        };

        $scope.marker = {
            id: 0,
            coords: {
                latitude: $scope.local.lat,
                longitude: $scope.local.long
            },
            options: { draggable: true },
            events: {
                dragend: function (marker, eventName, args) {
                    var lat = marker.getPosition().lat();
                    var lon = marker.getPosition().lng();
                    console.log("lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude);
                }
            }
        };

        $scope.save = function() {
            $ionicHistory.nextViewOptions({ disableBack: true });
            $scope.local.lat = $scope.marker.coords.latitude;
            $scope.local.long = $scope.marker.coords.longitude;
            LocalesFactory.save($scope.local);
            $state.go("app.list");
        };

        $scope.delete = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Advertencia',
                template: '¿Estás seguro de que quieres eliminar este local?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    $ionicHistory.nextViewOptions({ disableBack: true });
                    LocalesFactory.delete( listid );
                    $state.go("app.list");
                }
            });
        };
    }
})();
