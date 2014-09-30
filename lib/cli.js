/**
 * Contains the necessary items for actually performing a test on the commandline.
 */

var rls = require('readline-sync');
var readline = require('readline');
var Test = require('./test');
var mongoose = require('mongoose');
var config = require("./config");
mongoose.connect(config.db);
var questionDb = require('./question.db');
var _ = require('lodash');

var maxQuestions = config.maxQuestions;


var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('❯ ');
rls.setPrompt('❯ ');

//Prompt for name and ability.
var studentName = 'Clay'; //rls.question('What is your name?: ');
var studentAbility = 5; //rls.question('What is your ability? (0 - 10): ');


// Set up the test.
var test = new Test(studentName, studentAbility);
var questionCount = 0;

var displayQuestion = function (question, count)
{
  'use strict';
  var letter = 'A';
  var questionAnswerMap = {}; // Used to map letter values to actual answers.
  console.log('Question ' + count + ': ');
  console.log(question.text);
  console.log('This question\'s difficulty is ' + question.difficulty);
  console.log('It has been asked' + question);

  _.each(question.answers, function (answer){
    questionAnswerMap[letter] = answer.text;
    console.log(letter + ') ' + answer.text);
    letter = String.fromCharCode(letter.charCodeAt() + 1);
  });
  var value = rls.prompt();
  while (questionAnswerMap[value] === null) {
    console.log('That wasn\'t an answer!  Try again.');
    value = rls.prompt();
  }
  console.log(value);

  return test.processResponse(question, questionAnswerMap[value]);
};

// Get the questions from the database.
var questions = questionDb.find().sort('-difficulty').exec();
questions.then(function (questions) {
  'use strict';
  // Register the questions with the test.
  test.addQuestions(questions);
  for (var i = 0; i < maxQuestions; i++) {
    var question = test.getNextQuestion();
    var correct = displayQuestion(question, questionCount);
    questionCount++;
    if (correct) { console.log('Correct!');}
    else {console.log('Incorrect!');}
    console.log('New ability = ' + test.getStudent().getAbility());
  }

  process.exit(0);
});




