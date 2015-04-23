angular.module('ruta.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $state, $ionicSideMenuDelegate, LoginFactory, $ionicLoading, store, $ionicPopup) {
    // Form data for the login modal
    $scope.loginData = {};

    //$scope.isLogged = false;
    $scope.isLogged = function(){
        var existsToken = store.get('jwt');
        if ( existsToken ) {
            return true;
        } else {
            return false;
        }
    };

    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    $scope.login = function() {
        $scope.modal.show();
    };

    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        $scope.loading = $ionicLoading.show({
            content: 'Consultando...',
            showBackdrop: false
        });

        $scope.loginData.username = $scope.loginData.username.toLowerCase();

        LoginFactory.getToken($scope.loginData)
        .success(function (data) {
            $ionicLoading.hide();
            store.set('jwt', data.token);
            $scope.closeLogin();
        })
        .error(function (error) {
            store.remove('jwt');
            console.log("ERROR = " + error );
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Error de autenticación',
                template: 'Revisa tu usuario y/o password'
            });
        });

    };

    $scope.logout = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Logout',
            template: '¿Estás seguro de que quieres salir?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                $ionicSideMenuDelegate.toggleLeft(true);
                store.remove('jwt');
                $state.go("app.list");
            }
        });
    };

    $scope.addSangucheria = function() {
        $state.go("app.add");
    };
})

.controller('ListCtrl', function($scope, LocalesFactory, $state) {
    $scope.list = LocalesFactory.getAll();
    $scope.seeDetail = function(input) {
        $state.go("app.detail",  {"listId" : input} );
    };
    $scope.mark = function(item) {
        item.marked = !item.marked;
        LocalesFactory.save(item);
    };
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
})

.controller('AddCtrl', function($scope, LocalesFactory, $state) {
    $scope.local = {};
    $scope.add = function() {
        $scope.local.lat = $scope.local.location.geometry.location.k;
        $scope.local.long = $scope.local.location.geometry.location.D;
        $scope.marked = false;
        LocalesFactory.add($scope.local);
        $state.go("app.list");
    };
})

.controller('MapCtrl', function($scope, LocalesFactory, $ionicPopup, $state) {
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

})

;
