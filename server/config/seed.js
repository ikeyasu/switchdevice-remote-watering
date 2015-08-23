/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Log = require('../api/log/log.model');
var Bluebird = require('bluebird');
var fs = Bluebird.promisifyAll(require('fs'));

var removalUser = User.find({}).remove().exec();
var removalLog = Log.find({}).remove().exec();
var removalThing = Thing.find({}).remove().exec();

Bluebird.all([removalLog, removalUser, removalThing])
  .then(function(){
    return User.create({
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin'
    });
  }).then(function() {
    return fs.readFileAsync(__dirname  + '/local.seed.json',  'utf-8');
  }).then(function(json) {
    var localSeed = JSON.parse(json);
    return User.create(localSeed.TEST_USER_GOOGLE);
  }).then(function(user){
    return Bluebird.all([
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
      }),
      Log.create([{
        name : 'watering',
        value : 'watered',
        user: user.id
      }, {
        name : 'voltage',
        value : '850',
        user: user.id
      }, {
        name : 'voltage',
        value : '851',
        user: user.id
      }])]);
  });
