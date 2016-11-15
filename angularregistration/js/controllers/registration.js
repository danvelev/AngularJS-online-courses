myApp.controller('RegistrationController', ['$scope', 'Authentication', function($scope, Authentication){
    
    //var ref = new Firebase(FIREBASE_URL);
    //var auth = $firebaseAuth(firebase.database().ref());
    
    $scope.login = function(){
        Authentication.login($scope.user);
    };// login
    
    $scope.logout = function(){
        Authentication.logout();
    };// logout
    
    $scope.register = function(){
        Authentication.register($scope.user);
    };// register
    
}]);// Controller