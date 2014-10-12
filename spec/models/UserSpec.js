/**
 * Tests for the User Model
 */
var expect = require('expect.js');
var User = require('../../lib/models/User');
var mongoose = require('mongoose');

var user;

describe('The User Model', function () {

  before (function () {
    mongoose.connect(require('../../config/test.env').db);
  });

  beforeEach(function () {
    user = new User({
      userId: 'testId',
      fullName: 'Testy McTester',
      email: 'testing@test.com',
      roles: 'student'
    });

  });

  afterEach(function () {
    User.remove().exec();

  });

  after(function () {
    mongoose.disconnect();
  });

  it('should save the model without problems', function (done) {
    user.save(function (err) {
      expect(err).to.be(null);
      done();
    });
  });

  it('should not allow saving without a user id', function (done) {
    user.userId = '';
    user.save(function (err) {
      expect(err).to.be.ok();
      done();
    });
  });

});