'use strict';

angular.module('remoteWateringApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth) {
    $scope.awesomeThings = [];
    var user_id = Auth.getCurrentUser()._id;

    $http.get('/api/things/user/' + user_id).success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.setWatering = function() {
      if($scope.newThing === '') {
        return;
      }
      console.log(Auth.getCurrentUser()._id);
      $http.post('/api/things', { name: 'watering', user_id: user_id, value: '20000' });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
