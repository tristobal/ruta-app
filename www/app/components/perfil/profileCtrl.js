(function() {
    'use strict';

    angular
    .module('ruta.profile', [])
    .controller('ProfileCtrl', profileCtrl);

    profileCtrl.$inject =  ['$scope', '$ionicLoading', 'ProfileFactory'];
    function profileCtrl($scope, $ionicLoading, ProfileFactory) {
        $scope.profileData = {};
        $scope.updateProfile = function() {

            $scope.loading = $ionicLoading.show({
                content: 'Consultando...',
                showBackdrop: false
            });

            ProfileFactory.updateProfile()
            .sucess(function(data){
                $ionicLoading.hide();
            })
            .error(function(data){
                $ionicLoading.hide();
            });

            alert($scope.profileData.email + '\n' + $scope.profileData.nickname.toLowerCase() + '\n' + $scope.profileData.password);
            $ionicLoading.hide();
        };
    }
})();
