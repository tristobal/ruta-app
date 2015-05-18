(function() {
    'use strict';

    angular
    .module('ruta.map', [])
    .controller('MapCtrl', mapCtrl);

    mapCtrl.$inject = ['$scope', 'LocalesFactory', '$ionicPopup', '$state', '$ionicLoading', 'uiGmapGoogleMapApi', 'uiGmapIsReady', '$timeout', 'RUTA_CONSTANTS'];
    function mapCtrl($scope, LocalesFactory, $ionicPopup, $state, $ionicLoading, uiGmapGoogleMapApi, uiGmapIsReady, $timeout, RUTA_CONSTANTS) {

        $scope.locales = LocalesFactory.getAll();

        $scope.map = {
            center: {
                latitude: RUTA_CONSTANTS.fuente_alemana_lat,
                longitude: RUTA_CONSTANTS.fuente_alemana_long
            },
            zoom: 16,
            bounds: {},
            options: {
                streetViewControl: false,
                panControl: false,
                maxZoom: 20,
                minZoom: 3
            }
        };

        $scope.markers = [];

        if ( $scope.locales.length === 0 ) {
            var alertPopup = $ionicPopup.alert({
                title: 'ERROR',
                template: 'Aún no se han agregado locales'
            });
        }

        var markersArray = [];
        for (var i = 0; i < $scope.locales.length; i++) {
            markersArray.push({
                latitude: $scope.locales[i].lat,
                longitude: $scope.locales[i].long,
                title: $scope.locales[i].nombre,
                id: $scope.locales[i].id,
                show: false
            });
        }
        $scope.markers = markersArray;

        $scope.centerOnMe = function() {
            if ($scope.gmap !== null) {
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
