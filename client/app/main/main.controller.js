'use strict';

angular.module('remoteWateringApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth) {
    $scope.awesomeThings = [];
    $scope.isLoggedIn = Auth.isLoggedIn;
    Auth.isLoggedInAsync(function(loggedIn) {
      if (!loggedIn) {
        return;
      }
      var userId = Auth.getCurrentUser()._id;
      $http.get('/api/things/user/' + userId).success(function(awesomeThings) {
        $scope.awesomeThings = awesomeThings;
        socket.syncUpdates('thing', $scope.awesomeThings);
      });
    });

    $scope.setWatering = function() {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (!loggedIn) {
          return;
        }
        var userId = Auth.getCurrentUser()._id;
        $http.post('/api/things', {name: 'watering', 'user_id': userId, value: '20000'});
        $scope.newThing = '';
      });
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
