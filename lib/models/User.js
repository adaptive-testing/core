/**
 * Represents an Adaptive Tester User
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  // Username/Id for the user.
  userId: {
    type: String,
    trim: true,
    required: true
  },
  // Full name for the user
  fullName: {
    type: String,
    trim: true,
    default: ''
  },
  // Email for the user
  email: {
    type: String,
    trim: true,
    default: '',
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  // AdaptiveTests the user has taken
  tests: {
    type: [{
      score: {
        type: Number
      },
      test: {
        type: Schema.Types.ObjectId, ref: 'AdaptiveTest'
      },
      ability: {
        type: Number
      }
    }]
  },
  // User role
  roles: {
    type: [{
      type: String,
      enum: ['student', 'teacher', 'admin']
    }],
    default: ['student']
  },
  // Last time user was updated
  updated: {
    type: Date
  },
  // When the user was created.
  created: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('User', UserSchema);