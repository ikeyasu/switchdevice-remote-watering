/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Log = require('../api/log/log.model');

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@example.com',
    password: 'test'
  }, function(err, user) {
    Thing.find({}).remove(function() {
      Thing.create({
        name : 'test-thing',
        value : '1000',
        user: user.id,
        active: true
      }, {
        name : 'watering',
        value : '2000',
        user: user.id,
        active: true
      });
    });
    Log.find({}).remove(function() {
      Log.create({
        name : 'watering',
        value : 'watered',
        user: user.id
      });
    });
  });
  User.create({

    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin'
  });
});

