/**
 * Used to store questions and cache them with the database.
 */

'use strict';

/**
 * Creates a new QuestionStore
 * @param {[Question]} Array of Question object ids.
 */
function QuestionStore() {
  this.hasFetched = false;
  this.questionsFetched = [];

}

QuestionStore.prototype.fetch = function () {
  if (!this.hasFetched) {
    return true;
  }
  return;
};

module.exports = QuestionStore;