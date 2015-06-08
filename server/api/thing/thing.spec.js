'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var User = require('../user/user.model');

describe('GET /api/things', function() {
  it('should respond with JSON array with seed value', function(done) {
    request(app)
      .get('/api/things')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        res.body.length.should.be.exactly(2);
        res.body[0].name.should.be.exactly("test-thing");
        res.body[0].value.should.be.exactly("1000");
        done();
      });
  });
});

describe('GET /api/things/watering', function() {
  it('should respond thing', function(done) {
    User.findOne({email: "test@example.com"}, function(err, user) {
      if (err) return done(err);
      request(app)
        .get('/api/things/watering/user/' + user.id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          console.log(res.body);
          res.body.should.be.instanceof(Object);
          res.body.name.should.be.exactly("watering");
          res.body.value.should.be.exactly("2000");
          should.not.exist(res.body.active);
          should.not.exist(res.body.id);
          should.not.exist(res.body.user);
          done();
        });
    });
  });
});

describe('GET /api/things/watering', function() {
  it('should respond thing', function(done) {
    User.findOne({email: "admin@example.com"}, function(err, user) {
      if (err) return done(err);
      request(app)
        .get('/api/things/watering/user/' + user.id)
        .expect(404)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Object);
          done();
        });
    });
  });
});
