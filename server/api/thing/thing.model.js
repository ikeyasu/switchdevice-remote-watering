'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingSchema = new Schema({
  name: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  value: String,
  active: Boolean
});

module.exports = mongoose.model('Thing', ThingSchema);
