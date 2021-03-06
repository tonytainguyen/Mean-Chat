(function () {
    'use strict';

    angular
        .module('meanChat.userAuth', [
            'ui.router',
            'ngResource',
            'btford.socket-io'
        ])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    /* @ngInject */
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('authenticate', {
                url: '',
                abstract: true,
                views: {
                    '@': {
                        templateUrl: 'app/components/user-auth/authentication.html',
                        controller: 'UserAuthController as UserAuth'
                    },
                    'nav-bar@': {
                        templateUrl: 'app/components/shared/top-nav.html'
                    }
                }
            })
            .state('authenticate.login', {
                url: '/login',
                templateUrl: 'app/components/user-auth/local-account/login.html'
            })
            .state('authenticate.register', {
                url: '/register',
                templateUrl: 'app/components/user-auth/local-account/registration.html'
            })
    } 
})();