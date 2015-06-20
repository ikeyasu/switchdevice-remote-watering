'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var User = require('../user/user.model');
var Log = require('./log.model');

describe('GET /api/logs', function() {
  beforeEach(function (done) {
    User.find({}).remove(function() {
      User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@example.com',
        password: 'test'
      }, function(err, user) {
        Log.find({}).remove(function() {
          Log.create([{
            name : 'watering',
            value : 'watered',
            user: user.id
          }, {
            name : 'voltage',
            value : '10',
            user: user.id
          }], function () {
            done();
          });
        });
      });
    });
  });

  it('/ should respond with Log array', function(done) {
    User.findOne({}, function (err, user) {
      request(app)
        .get('/api/logs/user/' + user.id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          res.body.should.be.instanceof(Array);
          res.body.length.should.be.exactly(2);
          res.body[0].name.should.be.exactly('watering');
          res.body[0].value.should.be.exactly('watered');
          should.exist(res.body[0].updated);
          done();
        });
    });
  });

  it('/ should not respond with incorrect user id', function(done) {
    request(app)
      .get('/api/logs/user/111111111111111111111111')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        res.body.length.should.be.exactly(0);
        done();
      });
  });

  it('/voltage/ should respond with Log array', function(done) {
    User.findOne({}, function (err, user) {
      request(app)
        .get('/api/logs/voltage/user/' + user.id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          res.body.should.be.instanceof(Array);
          res.body.length.should.be.exactly(1);
          res.body[0].name.should.be.exactly('voltage');
          res.body[0].value.should.be.exactly('10');
          should.exist(res.body[0].updated);
          done();
        });
    });
  });
});
