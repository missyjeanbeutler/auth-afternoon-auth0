angular.module('app', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.when('', '/');

        $stateProvider
          .state('home', {
            url: '/',
            templateUrl: '/templates/home.html'
          })
          .state('friend', {
            url: '/friend',
            templateUrl: '/templates/friend.html'
          })

          $urlRouterProvider.otherwise('/');

})