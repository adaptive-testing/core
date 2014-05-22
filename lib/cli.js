/**
 * Contains the necessary items for actually performing a test on the commandline.
 */

var rl = require('readline-sync');
var Test = require('./test');
var mongoose = require('mongoose');
var config = require("./config");
var db = mongoose.connect(config.db);
var questionDb = require('./question.db');


rl.setPrompt('❯ ');

//Prompt for name and ability.
var studentName = rl.question('What is your name?: ');
var studentAbility = rl.question('What is your ability? (0 - 10): ');

// Set up the test.
var test = new Test(studentName, studentAbility);

// Get the questions from the database.
var questions = questionDb.find().sort('-difficulty').exec();
questions.then(function (questions) {
  // Register the questions with the test.
  test.addQuestions(questions);
  console.log("here1")
  var question = test.getNextQuestion();
  console.log("here2");
  console.log(question);

  process.exit(0);
});




