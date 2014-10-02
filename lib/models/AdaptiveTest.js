/**
 * The mongoose model for an adaptive test.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdaptiveTestSchema = new Schema({
  // The test title.
  title: {
    type: String,
    required: true,
    trim: true
  },
  // Description of the test
  description: {
    type: String,
    trim: true
  },
  // Questions that are associated with this test.
  questions: {
    type: [Schema.Types.ObjectId],
    ref: 'Question',
    default: []
  },
  // The date this adaptive test was created (for auditing)
  created: {
    type: Date,
    default: Date.now
  },
  // Last time the test was updated
  updated: {
    type: Date
  }
});

// Register a mongoose model based on the AdaptiveTestSchema
var AdaptiveTest = mongoose.model('AdaptiveTest', AdaptiveTestSchema);

// Exported so that it can work in jasmine-node testing.
module.exports = AdaptiveTest;
