/**
 * Tests for the User Model
 */

var User = require('../../lib/models/User');
var mongoose = require('mongoose');

var user;
var originalTimeout;

describe('User Unit Tests', function () {

  // before(function () {
  //   mongoose.connect(require('../../config/test.env').db);
  // });

  // after(function () {
  //   mongoose.disconnect();
  // });

  beforeEach(function () {
    mongoose.connect(require('../../config/test.env').db);
    user = new User({
      userId: 'testId',
      fullName: 'Testy McTester',
      email: 'testing@test.com',
      roles: 'student'
    });

  });

  afterEach(function () {
    User.remove().exec();
    mongoose.disconnect();
  });

  it('should save the model without problems', function (done) {
    user.save(function (err) {
      expect(err).toBeNull();
      done();
    });
  });

  it('should not allow saving without a user id', function (done) {
    user.userId = '';
    user.save(function (err) {
      expect(err).toBeDefined();
      done();
    });
  });

})