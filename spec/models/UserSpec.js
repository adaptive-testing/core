/**
 * Tests for the User Model
 */

var User = require('../../lib/models/User');

var user;

describe('User Unit Tests', function () {

  beforeEach(function (){
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

  it('should save the model without problems', function () {
    user.save(function (err) {
      expect(err).toBeUndefined();
    })
  });

  it('should not allow saving without a user id', function () {
    user.userId = '';
    user.save(function (err) {
      expect(err).toBeDefined();
    });
  });

})