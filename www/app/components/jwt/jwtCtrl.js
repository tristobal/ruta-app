(function() {
    'use strict';

    angular
    .module('ruta.jwt', [])
    .controller('JWSCtrl', jwsCtrl);

    jwsCtrl.$inject =  ['$scope', 'LoginFactory'];
    function jwsCtrl($scope, LoginFactory) {
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
    }
})();
