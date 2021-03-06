(function () {
    'use strict';

    angular
        .module('meanChat.chat', [
            'ui.router'
        ])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    /* @ngInject */
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('chat', {
                url: '/chat',
                abstract: true,
                templateUrl: 'app/components/chat/chat.html',
                controller: 'ChatController as Chat'
            })
            .state('chat.users', {
                url: '',
                templateUrl: 'app/components/chat/partials/user-list.html'
            })
            .state('chat.profile', {
                url: '',
                templateUrl: 'app/components/chat/partials/user-profile.html'
            })
            .state('chat.people', {
                url: '',
                template: '<h1>Favorites</h1>'
            })
            .state('chat.visits', {
                url: '',
                template: '<h1>Recent Visits</h1>'
            })
            .state('chat.friends', {
                url: '',
                template: '<h1>Friends</h1>'
            })
    } 
})();