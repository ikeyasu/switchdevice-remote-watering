'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var User = require('../user/user.model');
var Thing = require('./thing.model');
var Log = require('../log/log.model');

describe('GET /api/things', function() {
  beforeEach(function(done) {
    User.find({}).remove(function() {
      User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@example.com',
        password: 'test'
      }, function(err, user) {
        Thing.find({}).remove(function() {
          Thing.create({
            name : 'watering',
            value : '1000',
            user: user.id,
            active: true
          }, {
            name : 'watering',
            value : '2000',
            user: user.id,
            active: false
          }, function() {
            Log.find({}).remove(function() {
              done();
            });
          });
        });
      });
    });
  });

  it('should respond with JSON array with seed value', function(done) {
    request(app)
      .get('/api/things')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        res.body.length.should.be.exactly(1);
        res.body[0].name.should.be.exactly("watering");
        res.body[0].value.should.be.exactly("1000");
        done();
      });
  });

  it('/api/things/watering should respond thing', function(done) {
    User.findOne({email: "test@example.com"}, function(err, user) {
      request(app)
        .get('/api/things/watering/user/' + user.id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Object);
          res.body.name.should.be.exactly("watering");
          res.body.value.should.be.exactly("1000");
          should.not.exist(res.body.active);
          should.not.exist(res.body.id);
          should.not.exist(res.body.user);
          done();
        });
    });
  });

  it('/api/things/watering should respond thing', function(done) {
    User.findOne({email: "test@example.com"}, function(err, user) {
      request(app)
        .get('/api/things/watering/user/' + user.id + '/voltage/100')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Object);
          res.body.name.should.be.exactly("watering");
          res.body.value.should.be.exactly("1000");
          should.not.exist(res.body.active);
          should.not.exist(res.body.id);
          should.not.exist(res.body.user);
          Log.find({}, function(err, logs) {
            logs.length.should.be.exactly(2);
            done();
          });
        });
    });
  });
});

