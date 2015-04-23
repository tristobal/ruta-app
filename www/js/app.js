angular.module('ruta', [
    'ionic',
    'ruta.controllers',
    'ruta.factories',
    'ruta.constants',
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
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    })

    .state('app.search', {
        url: "/search",
        views: {
            'menuContent': {
                templateUrl: "templates/search.html"
            }
        }
    })

    .state('app.map', {
        url: "/map",
        views: {
            'menuContent': {
                templateUrl: "templates/map.html",
                controller: "MapCtrl"
            }
        }
    })

    .state('app.add', {
        url: "/add",
        views: {
            'menuContent': {
                templateUrl: "templates/add.html",
                controller: 'AddCtrl'
            }
        }
    })

    .state('app.list', {
        url: "/list",
        cache: false,
        views: {
            'menuContent': {
                templateUrl: "templates/list.html",
                controller: 'ListCtrl'
            }
        }
    })

    .state('app.detail', {
        url: "/list/:listId",
        views: {
            'menuContent': {
                templateUrl: "templates/detail.html",
                controller: 'DetailCtrl'
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
