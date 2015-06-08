'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('remoteWateringApp'));
  beforeEach(module('socketMock'));

  var MainCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/things')
      .respond(['test1', 'test2']);

    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  // TODO: test
  it('should attach a list of things to the scope', function () {
    //$httpBackend.flush();
    //expect(scope.awesomeThings.length).toBe(4);
  });
});
