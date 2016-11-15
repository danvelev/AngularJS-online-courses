var myApp = angular.module('myApp', ['ngRoute', 'firebase']).constant('FIREBASE_URL', 'https://angulartesting-2bdca.firebaseio.com/');

myApp.run(['$rootScope', '$location', function($rootScope, $location){
    $rootScope.$on('$routeChangeError', function(event, next, previous, error){
       if(error = 'AUTH_REQUIRED'){
           $rootScope.message = 'Sorry you must be logged in to access that page.';
           $location.path('/login');
           $rootScope.$apply();
       } 
    });
}]);

myApp.config(['$routeProvider', function($routeProvider){
    $routeProvider.
        when('/login', {
            templateUrl: 'views/login.html',
            controller: 'RegistrationController'
    }).
        when('/register', {
            templateUrl: 'views/register.html',
            controller: 'RegistrationController'
    }).
        when('/success', {
            templateUrl: 'views/success.html',
            controller: 'SuccessController',
            resolve: {
                "currentAuth" : ['$http', '$q', 'Authentication', function($http, $q, Authentication){
                    //return Authentication.requireAuth();
                    
                    //manual with angular
                    var deffered = $q.defer();
                    if(Authentication.requireAuth()){
                        deffered.resolve();
                    }else {
                        deffered.reject('AUTH_REQUIRED');
                    }
                    return deffered.promise;
                    
                }]// currentAuth
            }// resolve
    }).
        otherwise({
            redirectTo: '/login'
    });
}]);