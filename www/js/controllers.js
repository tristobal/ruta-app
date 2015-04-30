angular.module('ruta.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $state, $ionicSideMenuDelegate, LoginFactory, $ionicLoading, store, $ionicPopup, SharedProperties) {
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

    $scope.editSangucheria = function() {
        var listId = SharedProperties.getIdLocal();
        $state.go("app.edit", {"listId" : listId});
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

.controller('DetailCtrl', function($scope, $stateParams, LocalesFactory, SharedProperties, uiGmapIsReady, $ionicLoading, FUENTE_ALEMANA) {
    var listid = $stateParams.listId;
    SharedProperties.setIdLocal( listid );
    $scope.local = LocalesFactory.getById( listid );

    var center_lat = FUENTE_ALEMANA.lat;
    var center_long = FUENTE_ALEMANA.long;

    if( typeof $scope.local.lat !== "undefined" ) {
        center_lat = $scope.local.lat;
        center_long = $scope.local.long;
    }

    $scope.map = {
        center: {
            latitude: center_lat,
            longitude: center_long
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


    $scope.centerOnMe = function() {
        if ($scope.gmap != null) {
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
})

.controller('EditCtrl', function($scope, LocalesFactory, $state, $stateParams, $ionicHistory, $ionicPopup) {
    $scope.local = {};
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
        id: 0,
        coords: {
            latitude: $scope.local.lat,
            longitude: $scope.local.long
        },
        options: { draggable: true },
        events: {
            dragend: function (marker, eventName, args) {
                var lat = marker.getPosition().lat();
                var lon = marker.getPosition().lng();
                console.log("lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude);
            }
        }
    };

    $scope.save = function() {
        $ionicHistory.nextViewOptions({ disableBack: true });
        $scope.local.lat = $scope.marker.coords.latitude;
        $scope.local.long = $scope.marker.coords.longitude;
        LocalesFactory.save($scope.local);
        $state.go("app.list");
    };

    $scope.delete = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Advertencia',
            template: '¿Estás seguro de que quieres eliminar este local?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                $ionicHistory.nextViewOptions({ disableBack: true });
                LocalesFactory.delete( listid );
                $state.go("app.list");
            }
        });
    };
})

.controller('AddCtrl', function($scope, LocalesFactory, $state) {
    $scope.local = {};
    $scope.add = function() {
        $scope.local.lat = $scope.local.location.geometry.location.lat();
        $scope.local.long = $scope.local.location.geometry.location.lng();
        $scope.marked = false;
        LocalesFactory.add($scope.local);
        $state.go("app.list");
    };
})

.controller('MapCtrl', function($scope, LocalesFactory, $ionicPopup, $state, $ionicLoading, uiGmapGoogleMapApi, uiGmapIsReady, $timeout) {

    $scope.locales = LocalesFactory.getAll();

    $scope.map = {
        center: {
            latitude: -33.4374848,
            longitude: -70.63586149999998
        },
        //control: {},
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
        if ($scope.gmap != null) {
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
})

.controller('JWSCtrl', function($scope, LoginFactory) {
    $scope.resultado = "";
    $scope.variables = {};

    //VERIFYING THE TOKEN
    $scope.verifyJWS = function(){

        LoginFactory.getCertificate()
        .success(function (data) {
            var sJWS = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJzdWIiOiI1NTFhYmU3MWIyYzZhZWRjMWU0ZmNiMTMiLCJleHAiOjE0MzAyMzQwNjksImlhdCI6MTQzMDE0NzY2OX0.fWaRj6pgG5DYX_3-pdNbcFK0MshF7ew-bWN-NG6vn2RRoGADsyc1wgTytsRNNshj3E9dhJQ432gQRjeeWlCBSy2VdRsbNSQZQwl2NdEYJsqzCG2EO2KCwATtezfa242XpFhB2dXwxRLMHmoAJVTb5VmaoyNZBu8iDoN_K-dklKRfqiR5rC_HNCSdmvPB6KPbSEXKCVrJXJ-l0l8ljs9Ytrkq65AZhZZKAVHPhV12SI_JhBZg7YA2VX3WPUFkGysmprfQHr3urKccdUVZSUuZAFb2U0bSVHJaSKf0Q54kPQl3lTyqxLrSJhWw6GBAZEhSYRfO0APLhDJrA-oRJccUDg";
            var sPemX509Cert = "-----BEGIN CERTIFICATE-----"+
            "MIIDXTCCAkWgAwIBAgIJAJ47j5+A//fJMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV"+
            "BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX"+
            "aWRnaXRzIFB0eSBMdGQwHhcNMTUwNDI0MTUwMDM4WhcNMTYwNDIzMTUwMDM4WjBF"+
            "MQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50"+
            "ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB"+
            "CgKCAQEAnLuxFWhbZ2S5kSCnR7SkBy6HF5ud0XDMhcKH1nwCMQye12LRMcRUEzG7"+
            "st/kBhHtNmnhnttKIz8XOV/Fg3cvWrpTGs3Nf3Ph+abprZjyYJOFL8RfeXBeOmNg"+
            "T3mfMg57MgXegSpWzjgbyLo1zONwa1uPBLot4OQerWm0IRmlW8e3Zguta0qywBYT"+
            "6/GQDWm2ESCmaWL3JbHXVnT+TiZQJNe2rQ2snsLXcijNeaHKUoCIgOcE+FweSiGy"+
            "pHIsF81bdVONV+/EMIKEB9oa3iDYXWXjLRhBisb/7NzmOgXHmb63e0thT4WIf7SI"+
            "I7lFcYRLUxidbqy1Y1BUz3sGTr2dKQIDAQABo1AwTjAdBgNVHQ4EFgQUpc/58nZq"+
            "ZiB/OlEVp3Ytdw2hXW8wHwYDVR0jBBgwFoAUpc/58nZqZiB/OlEVp3Ytdw2hXW8w"+
            "DAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAX7DRa4YlkadD6J4wTzwM"+
            "IrlLHb/Ex1wKUao6SGDudLt695NXAVIsW0vW9uWcfWEBquMlHWAzePKEq7nCgGXV"+
            "d2bLLS+XBeVZkkWoNfkTd1ock1nDnOK586zgepVyc4zDnPXRU6vxdmLtVKZT8CRF"+
            "09E6ns992G8WoXIXl6V2uTfgFseIrl1eg95rDR9qdB+dt0Lf9zhSPoVlCHVGNxMt"+
            "U0oUnhzQQzi6c1RQ1m5i7LLniDJXdkO759RPTK+Pm8hFUZ1RoFhTYbm9GxF+6asD"+
            "oae49VIz4xr8CRvwGMdzqVXFR7oOSy4Y0VuGu9gCdTL3qWMti+W7YZ4g99DyOkqx"+
            "/Q=="+
            "-----END CERTIFICATE-----";
            var cer = $scope.variables.certificado; //data.certificate;
            //console.log($scope.variables.certificado);
            console.log(cer);

            var jws = new KJUR.jws.JWS();
            //var result = jws.verifyJWSByPemX509Cert(sJWS, sPemX509Cert);
            var result = jws.verifyJWSByPemX509Cert(sJWS, cer);
            $scope.resultado = result;
        })
        .error(function (error) {
            console.log("ERROR = " + error );
            $scope.resultado = error;
        });

    };
})
;
