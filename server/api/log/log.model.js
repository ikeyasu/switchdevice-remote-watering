'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LogSchema = new Schema({
  name: String,
  value: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', LogSchema);
