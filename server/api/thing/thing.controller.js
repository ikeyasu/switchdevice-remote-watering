/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Thing = require('./thing.model');
var User = require('../user/user.model');

// Get list of things
exports.index = function(req, res) {
  var condition = {};
  var user_id = req.params.user_id;
  if (user_id) {
    condition = _.merge(condition, {user: user_id});
  }
  Thing.find(condition, function (err, things) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, things);
  });
};

// Get a single thing
exports.show = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    return res.json(thing);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  User.findById(req.body.user_id, function(err, user) {
    if (err) return res.json(401);
    if (user) {
      req.body.user = user._id;
    }
    req.body.active = true;
    Thing.create(req.body, function(err, thing) {
      if(err) { return handleError(res, err); }
      return res.json(201, thing);
    });
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Thing.findById(req.params.id, function (err, thing) {
    if (err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    var updated = _.merge(thing, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, thing);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    thing.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.watering = function(req, res) {
  var condition  = {user: req.params.user_id, active: true, name: "watering"};
  Thing.findOne(condition, function (err, thing) {
    if (err) return handleError(res, err);
    if (!thing) return res.json(404, {});
    thing.active = false;
    thing.save(function(err) {
      if (err) return handleError(res, err);
      return res.json(200, {
        name: thing.name,
        value: thing.value,
        now: (new Date()).toISOString()
      });
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
