angular.module('ruta', [
    'ionic',
    'ruta.menu',
    'ruta.loginfactory',
    'ruta.localesfactory',
    'ruta.constants',
    'ruta.services',
    'ruta.jwt',
    'ruta.add',
    'ruta.detail',
    'ruta.edit',
    'ruta.list',
    'ruta.map',
    'ion-google-place',
    'uiGmapgoogle-maps',
    'angular-storage'
])

.run(function($ionicPlatform, $rootScope, $state) {
    $rootScope.$state = $state;
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });


})

.directive('stopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                e.stopPropagation();
            });
        }
    };
})

.config(function($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {
    $stateProvider

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "app/components/menu/menu.html",
        controller: 'MenuCtrl'
    })

    .state('app.list', {
        url: "/list",
        cache: false,
        views: {
            'menuContent': {
                templateUrl: "app/components/listado/list.html",
                controller: 'ListCtrl'
            }
        }
    })

    .state('app.detail', {
        url: "/list/:listId",
        cache: false,
        views: {
            'menuContent': {
                templateUrl: "app/components/listado/detail.html",
                controller: 'DetailCtrl'
            }
        }
    })

    .state('app.edit', {
        url: "/edit/:listId",
        views: {
            'menuContent': {
                templateUrl: "app/components/listado/edit.html",
                controller: 'EditCtrl'
            }
        }
    })

    .state('app.add', {
        url: "/add",
        views: {
            'menuContent': {
                templateUrl: "app/components/listado/add.html",
                controller: 'AddCtrl'
            }
        }
    })

    .state('app.map', {
        url: "/map",
        views: {
            'menuContent': {
                templateUrl: "app/components/mapa/map.html",
                controller: "MapCtrl"
            }
        }
    })

    .state('app.jws', {
        url: "/jws",
        cache: false,
        views: {
            'menuContent': {
                templateUrl: "app/components/jwt/jws.html",
                controller: 'JWSCtrl'
            }
        }
    });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/list');

    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyB16sGmIekuGIvYOfNoW9T44377IU2d2Es',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
});
