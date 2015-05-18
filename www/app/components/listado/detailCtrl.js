(function() {
    'use strict';

    angular
    .module('ruta.detail', [])
    .controller('DetailCtrl', detailCtrl);

    detailCtrl.$inject = ['$scope', '$stateParams', 'LocalesFactory', 'SharedProperties', 'uiGmapIsReady', '$ionicLoading', 'RUTA_CONSTANTS'];
    function detailCtrl($scope, $stateParams, LocalesFactory, SharedProperties, uiGmapIsReady, $ionicLoading, RUTA_CONSTANTS) {
        var listid = $stateParams.listId;
        SharedProperties.setIdLocal( listid );
        $scope.local = LocalesFactory.getById( listid );

        var center_lat = RUTA_CONSTANTS.fuente_alemana_lat;
        var center_long = RUTA_CONSTANTS.fuente_alemana_long;
        console.log( RUTA_CONSTANTS.fuente_alemana_lat );
        if( typeof $scope.local.lat !== "undefined" ) {
            center_lat = $scope.local.lat;
            center_long = $scope.local.long;
        }

        $scope.map = {
            center: {
                latitude: center_lat,
                longitude: center_long
            },
            zoom: 16,
            bounds: {}
        };

        $scope.marker = {
            coords: {
                latitude: $scope.local.lat,
                longitude: $scope.local.long
            },
            title: $scope.local.nombre,
            id: $scope.local.id,
            show: false
        };


        $scope.centerOnMe = function() {
            if ($scope.gmap != null) {
                if(!$scope.map) {
                    return;
                }
                $scope.loading = $ionicLoading.show({
                    showBackdrop: false
                });
                navigator.geolocation.getCurrentPosition(function(pos) {
                    console.log(pos.coords.latitude + "|"+pos.coords.longitude);
                    $scope.gmap.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                    $ionicLoading.hide();
                }, function(error) {
                    alert('Unable to get location: ' + error.message);
                });
            } else {
                console.log("Sorry mate. $scope.gmap == null");
            }
        };

        $scope.map.control = {}; // this is filled when google map is initiated
        uiGmapIsReady.promise().then(function (maps) {
            console.log("uiGmapIsReady");
            $scope.gmap = maps[0].map;
        });
    }

})();
