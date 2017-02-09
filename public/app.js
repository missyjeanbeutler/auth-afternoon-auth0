angular.module('test', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('login', {
        url: '/',
        template: '<a href="/auth/github">Log in</a>',
        controller: 'testCtrl'
      })
      .state('home', {
        url: '/home',
        templateUrl: './home.html',
        controller: 'homeCtrl'
      })
      .state('friend', {
        url: '/friend/:github_username',
        templateUrl: './friend.html',
        controller: 'friendsCtrl'
      })
  })
  .controller('testCtrl', function ($scope, testSrvc, $state) {
    $scope.login = function () {
      console.log('logging in');
      testSrvc.login().then(function (response) {
        if (response.status == 200) {
          console.log('logged in', response);
          $state.go('home')
        }
      })
    }
  })
  .controller('homeCtrl', function ($scope, testSrvc, $rootScope, $state) {
    testSrvc.getFollowing().then(function (response) {
      $scope.followers = response;
      // $rootScope.$on('unauthorized', function () {
      //   $state.go('login')
      // })
    })
  })
  .controller('friendsCtrl', function ($scope, $stateParams, testSrvc) {
    testSrvc.getActivity($stateParams.github_username).then(function (response) {
      $scope.activity = response;
    })
  })
  .service('testSrvc', function ($http) {
    this.getFollowing = function () {
      return $http({
        method:'GET',
        url: '/api/github/followers'
      }).then(function (response) {
        return response.data;
      })
    }

    this.getActivity = function (username) {
      return $http({
        method: 'GET',
        url: 'api/github/' + username + '/activity'
      }).then(function (response) {
        return response.data
      })
    }
  })
  .config(function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.interceptors.push('myHttpInterceptor');
})

// register the interceptor as a service
  .factory('myHttpInterceptor', function() {
    return {
        'responseError': function(rejection) {
            if (rejection.status == 403) {
              document.location = '/';
                return rejection;
            }
            return rejection;
        }
    };
});
