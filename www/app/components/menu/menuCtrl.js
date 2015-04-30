
(function() {
    'use strict';

    angular
    .module('ruta.menu', [])
    .controller('MenuCtrl', menuCtrl);

    menuCtrl.$inject = ['$scope', '$ionicModal', '$state', '$ionicSideMenuDelegate', 'LoginFactory', '$ionicLoading', 'store', '$ionicPopup', 'SharedProperties'];
    function menuCtrl($scope, $ionicModal, $state, $ionicSideMenuDelegate, LoginFactory, $ionicLoading, store, $ionicPopup, SharedProperties) {
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

        $ionicModal.fromTemplateUrl('app/components/menu/login.html', {
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
            console.log('Doing login');

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

        $scope.editSangucheria = function() {
            var listId = SharedProperties.getIdLocal();
            $state.go("app.edit", {"listId" : listId});
        };
    }
})();
