angular.module('interim.chat', ["firebase", "luegg.directives"])

.controller('ChatController', function ($scope, $firebaseArray, $rootScope, $firebaseObject, $modal) {
  $scope.userInfo = $rootScope.userInfo ? $rootScope.userInfo : $rootScope.communityInfo;
  var userCurrentID = $rootScope.userInfo ? $rootScope.userInfo.id : $rootScope.communityInfo.id;
  var ref = new Firebase("https://interim.firebaseio.com/room-messages");
  //get all messages for specific room
  $rootScope.messages = function(roomId) {
    //get data for specific room
    var messages = $firebaseArray(ref.child(roomId));
    
    $scope.messages = messages;
    $scope.roomId = roomId;

    //show chat input when room is selected
    $("#chatRow").css('visibility', 'visible');
  };

  //send messages to specific room
  $scope.sendMessage = function() {

    //check if message is empty
    if ($scope.msg) {
      // make sure message is under 120 characters
      if ($scope.msg.length < 121) {
        var msg = ref.child($scope.roomId).push();
        var message = {
          userId: userCurrentID,
          userProfileImage: $rootScope.userInfo ? $rootScope.userInfo.avi_url : null,
          name: $rootScope.userInfo ? $rootScope.userInfo.name : $rootScope.communityInfo.name,
          timestamp: Firebase.ServerValue.TIMESTAMP,
          message: $scope.msg,
          type: 'default'
        };
        //reset input box
        $scope.msg = "";
        msg.set(message);
      } else {
        //notify is message is over 120 characters
        var lengthExceeded = $scope.msg.length - 120;
        $.notify("Your message exceeds length by " + lengthExceeded +
          "  characters", "error");
      }
    } 
  };

  //this function creates a popup modal with the users information
  $scope.userModal = function(user) {
    var name = user.name;   
    $scope.userName = name;
    $modal.open({
      templateUrl: 'app/userProfile/userProfile.html',
      backdrop: true,
      windowClass: 'modal',
      controller: 'UserProfileController',
      resolve: {
        user: function () {
          return $scope.userName;
        }
      }
    });
  };
});
