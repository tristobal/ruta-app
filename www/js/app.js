// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('ruta', ['ionic', 'ruta.controllers', 'ruta.factories', 'ion-google-place'])

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

.config(function($stateProvider, $urlRouterProvider) {
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

    .state('app.browse', {
        url: "/browse",
        views: {
            'menuContent': {
                templateUrl: "templates/browse.html"
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
});
