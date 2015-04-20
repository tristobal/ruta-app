angular.module('ruta.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, $ionicSideMenuDelegate) {
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };

    $scope.addSangucheria = function() {
        $state.go("app.add");
    };
})

.controller('ListCtrl', function($scope, LocalesFactory) {
    $scope.list = LocalesFactory.getAll();
})

.controller('DetailCtrl', function($scope, $stateParams, LocalesFactory) {
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
        coords: {
            latitude: $scope.local.lat,
            longitude: $scope.local.long
        },
        title: $scope.local.nombre,
        id: $scope.local.id,
        show: false
    };
    console.log($scope.marker);
})

.controller('AddCtrl', function($scope, LocalesFactory, $state) {
    $scope.local = {};
    $scope.add = function() {
        $scope.local.lat = $scope.local.location.geometry.location.k;
        $scope.local.long = $scope.local.location.geometry.location.D;
        LocalesFactory.save($scope.local);
        $state.go("app.list");
    };
})

.controller('MapCtrl', function($scope, LocalesFactory) {
    $scope.locales = LocalesFactory.getAll();
    $scope.map = {
        center: {
            latitude: -33.4374848,
            longitude: -70.63586149999998
        },
        zoom: 16,
        bounds: {}
    };
    /*$scope.options = {
        scrollwheel: false
    };*/

    $scope.markers = [];
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

    // Get the bounds from the map once it's loaded
    /*$scope.$watch(function() {
        return $scope.map.bounds;
    }, function(nv, ov) {
        // Only need to regenerate once
        if (!ov.southwest && nv.southwest) {
            var markers = [];
            for (var i = 0; i < $scope.locales.length; i++) {
                markers.push({
                    latitude: $scope.locales[i].lat,
                    longitude: $scope.locales[i].long,
                    title: $scope.locales[i].nombre,
                    id: $scope.locales[i].id,
                });
            }
            $scope.randomMarkers = markers;
        }
    }, true);*/

})

;
