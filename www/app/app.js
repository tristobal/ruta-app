angular.module('ruta', [
    'ionic',
    'ruta.menu',
    'ruta.loginfactory',
    'ruta.localesfactory',
    'ruta.profilefactory',
    'ruta.constants',
    'ruta.services',
    'ruta.directives',
    'ruta.jwt',
    'ruta.add',
    'ruta.detail',
    'ruta.edit',
    'ruta.list',
    'ruta.map',
    'ruta.profile',
    'ion-google-place',
    'uiGmapgoogle-maps',
    'angular-storage'
])

.run(function($ionicPlatform, $rootScope, $state, store, LoginFactory, SharedProperties, $ionicPopup) {
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


    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        //Validar token expirado solo si este existe
        var token = store.get('jwt');
        if (token) {
            var expiration = SharedProperties.getTokenExpiration();
            var currentTime = parseInt(Math.floor(Date.now() / 1000));
            if ( currentTime >= expiration) {
                var alertExpired = $ionicPopup.alert({
                    title: 'Error',
                    template: 'Sesión expirada'
                });
                alertExpired.then(function(res) {
                    store.remove('jwt');
                    //$state.go("app.list");
                });
            }
        }

    });


    /*
     * 1.-   Obtener el certificado para validar el token.
     * 2.-   Preguntar si existe el token.
     * 2.1.- Validar el token.
     * 2.2.- Guardar el id del usuario asociado al token.
     * 2.3.- Validar expiración de la sesión.
     */
    $rootScope.validacionInicial = function() {
        console.log("Obteniendo certificado...");

        LoginFactory.getCertificate()
        .success(function (data) {
            console.log("Certificado obtenido");
            store.set('certificate', data.certificate);

            var token = store.get('jwt');
            if (token) {
                //@TODO Sacar este log imbécil
                console.log("token = " + token);
                var jws = new KJUR.jws.JWS();
                var result = jws.verifyJWSByPemX509Cert(token, data.certificate);
                if (result) {
                    var jswPayloads = decodeURIComponent(escape(window.atob( jws.parsedJWS.payloadB64U )));
                    var payLoads = JSON.parse(jswPayloads);
                    SharedProperties.setIdUser(payLoads.sub);
                    SharedProperties.setTokenExpiration(payLoads.exp);

                    var expiration = SharedProperties.getTokenExpiration();
                    var currentTime = parseInt(Math.floor(Date.now() / 1000));

                    //console.log("TOKEN: " + expiration + "\nNOW:   " + currentTime);
                    if ( currentTime >= expiration) {
                        var alertExpired = $ionicPopup.alert({
                            title: 'Error',
                            template: 'Sesión expirada'
                        });
                        alertExpired.then(function(res) {
                            store.remove('jwt');
                            $state.go("app.list");
                        });
                    }
                } else {
                    var alertInvalid = $ionicPopup.alert({
                        title: 'Error',
                        template: 'Token inválido'
                    });
                    alertInvalid.then(function(res) {
                        store.remove('jwt');
                        $state.go("app.list");
                    });
                }
            }
        })
        .error(function (err) {
            console.log("Error al obtener certificado. " + err);
        });

    };
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

.config(function($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider, $httpProvider) {
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

    .state('app.profile', {
        url: "/profile",
        views: {
            'menuContent': {
                templateUrl: "app/components/perfil/profile.html",
                controller: "ProfileCtrl"
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

    $httpProvider.interceptors.push(['$q', function($q) {
        return {
            request: function(httpConfig) {
                var token = localStorage.getItem('jwt');
                if (token) {
                    //Solución parche por las comillas de Localstorage
                    token = token.replace(/(^\")|("$)/gi, "");
                    httpConfig.headers['x-access-token'] = token;
                }
                return httpConfig;
            },
            responseError: function(response) {
                return $q.reject(response);
            }
        };
    }]);

    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyB16sGmIekuGIvYOfNoW9T44377IU2d2Es',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
});
