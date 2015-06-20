'use strict';

angular.module('remoteWateringApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth) {
    $scope.things = [];
    $scope.logs = [];
    $scope.isLoggedIn = Auth.isLoggedIn;
    Auth.isLoggedInAsync(function(loggedIn) {
      if (!loggedIn) {
        return;
      }
      var userId = Auth.getCurrentUser()._id;
      $http.get('/api/things/user/' + userId).success(function(things) {
        $scope.things = things;
        socket.syncUpdates('thing', $scope.things);
      });
      $http.get('/api/logs/user/' + userId).success(function(logs) {
        $scope.logs = logs;
        socket.syncUpdates('log', $scope.logs);
      });
    });

    $scope.setWatering = function(msec) {
      msec = !msec ? 20000 : msec;
      Auth.isLoggedInAsync(function(loggedIn) {
        if (!loggedIn) {
          return;
        }
        var userId = Auth.getCurrentUser()._id;
        $http.post('/api/things', {name: 'watering', 'user_id': userId, value: msec.toString()});
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
