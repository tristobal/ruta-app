angular.module('ruta.constants', [])

.constant('AUTH_EVENTS', {
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
})

.constant('FUENTE_ALEMANA', {
    lat: -33.4374848,
    long: -70.63586149999998
})

.constant('USER_ROLES', {
    admin: 'admin_role',
    public: 'public_role'
});
