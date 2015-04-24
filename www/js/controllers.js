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


.controller('JWSCtrl', function($scope) {
    //VERIFYING THE TOKEN
    var sJWS = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE0Mjk4ODc5NzF9.aNDXY4pZAJTPRNyiOp6cwlD1tjPmv5crwe8J4mNrUb_iST7mv8VWJ2a8eHxKKAGGGIb-cjcKtoELyuNjUggzc7TeRsoonoVI1LmZjMhsTLJVcVtEVn6ZF7uwQEjE-YR37RAlAdFbPnf_hJLowZYy2tR9lvAmQLR4hr__dzyps2z9midtE3Sl6CZ1lX-OJwLR5V71DvIsfsjdr9RnLmUPvWOZgZFHoW4aRMf1RrtP4o8kOedgYBcJceJad8h4PNxsaqKj4ayXCbLkXw19TvfwSyZ-9AN81Qfkvd1gCvauPHJE6q-q7OEqzkzZ2unNNp5-13j85gwoXE_99t56XXnIBQ";
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
    var jws = new KJUR.jws.JWS();
    jws.isSafeJSONString = function(s, h, p) {
        var o = null;
        try {
    	o = jsonParse(s);
    	if (typeof o != "object") return 0;
    	if (o.constructor === Array) return 0;
    	if (h) h[p] = o;
    	return 1;
        } catch (ex) {
    	return 0;
        }
    };
    var result = jws.verifyJWSByPemX509Cert(sJWS, sPemX509Cert);
    $scope.resultado = result;
})
;
