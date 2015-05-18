angular.module('ruta.constants', [])

.constant('AUTH_EVENTS', {
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
})

.constant('USER_ROLES', {
    admin: 'admin_role',
    public: 'public_role'
})

.constant('RUTA_CONSTANTS', {
    url_base: "http://localhost:3000",
    id_list: 1,
    fuente_alemana_lat: -33.4374848,
    fuente_alemana_long: -70.63586149999998
});
