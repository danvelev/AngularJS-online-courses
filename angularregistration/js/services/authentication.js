myApp.factory('Authentication', ['$rootScope', '$location', function($rootScope, $location){
    
    
    firebase.auth().onAuthStateChanged(function(authUser){
        console.log("change in auth detected");
        
        if(authUser){
            var id = firebase.auth().currentUser.uid;
          
            firebase.database().ref('users/' + id).once('value').
                then(function(results){
                  console.log("user found");
                  $rootScope.$apply(function(){
                      $rootScope.currUser = results.val();
                    });
                }).catch(function(error){
                  $rootScope.$apply(function(){
                      console.log("problemmmm");
                      $rootScope.currUser = '';
                    });
                }); // catch
          
        } else {  // When user signsout
          $rootScope.$apply(function(){
           console.log("signed out");
           $rootScope.currUser = '';
            }); // else
      }
    });// auth state change
    
    var myObject = {
      login: function(user){
          
          console.log("login starts");
          
          firebase.auth().signInWithEmailAndPassword(user.email, user.password).
            then(function(regUser){
              console.log("login success");
              
              $location.path('/success'); // not working -- looks like angular is confused with firebase as 3rd party lib
              $rootScope.$apply(); // let angular know that changes are applied
                            
              console.log("login redirect");
              
            }).catch(function(error){
              console.log("login error");
              
              $rootScope.$apply(function(){
                  $rootScope.message = error.message;
              });
            });
        
      },//login
        
        
        logout: function(){
          firebase.auth().signOut();
        }, // logout
        
        requireAuth: function(){
            //return firebase.auth().$requireSignIn(); this is not working TRY WITH CURRENT USER
            return firebase.auth().currentUser;
        }, //require auth
        
        register: function(user){
            
            console.log("Firing statement to firebase");
            
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password).
                then(function(regUser){
                    
                    firebase.database().ref('/users').child(regUser.uid).set({
                        date: firebase.database.ServerValue.TIMESTAMP,  //timestamp of the server
                        firstname: user.firstname,
                        lastname: user.lastname,
                        reguser: regUser.uid, 
                        email: user.email
                    });// user info
                    
                    console.log("RegUser returned");
                    
                    // after successful registration log user in
                    myObject.login(user);
                    
                    console.log("message should have been displayed");
                
                }).catch(function(error){
                    console.log("Error cought");
                    $rootScope.$apply(function(){
                        $rootScope.message = error.message;
                    });
                    
                    console.log("Error message should have been displayed");
                }); // create user
        }// register
    };
    
    return myObject;
    
}]);



