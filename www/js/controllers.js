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
})

.controller('AddCtrl', function($scope, LocalesFactory, $state) {
    $scope.local = {};
    $scope.add = function() {
        $scope.local.lat = $scope.local.location.geometry.location.k;
        $scope.local.long = $scope.local.location.geometry.location.D;
        LocalesFactory.save($scope.local);
        $state.go("app.list");
    };
});
