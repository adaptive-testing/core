/**
 * Contains the basic workings of taking a test on the command-line.
 */

// Include a few needed functions/files.
var _ = require('underscore');
var Test = require('./test');
var rls = require('readline-sync');
var readline = require('readline');
var mongoose = require('mongoose');
var config = require('./config');
var db = mongoose.connect(config.db);
var questionDb = require('./question.db');




// Setup the command line I/O
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('❯ ');
rls.setPrompt('❯ ');

/**
 * Displays a question for the user.
 */
var askQuestion = function (question, count) {
  'use strict';
  var letter = 'A';
  var questionAnswerMap = {}; // Used to map letter values to actual answers.
  console.log('');
  console.log('Question ' + count + ': ');
  console.log(question.text);
  console.log('This question\'s difficulty is ' + question.difficulty);
  console.log('It has been asked ' + question.asked + ' times.');
  console.log('It has been answered correctly ' + question.correct + ' times.');
  console.log('Your current ability is:' + currentTest.getStudent().getAbility());

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

  return currentTest.processResponse(question, questionAnswerMap[value]);
};


//Prompt for name and ability.
var studentName = 'Clay'; //rls.question('What is your name?: ');
var studentAbility = 5; //rls.question('What is your ability? (0 - 10): ');


// Start a test
var currentTest = new Test(studentName, studentAbility);


// Pull the questions from the test database.
var questions = questionDb.find().sort('-difficulty').exec();
questions.then(function (questions) {
  'use strict';

  // Add all the questions to the test.
  currentTest.addQuestions(questions);

  // Used to handle stopping the test.
  var keepTesting = true;
  // Used to track the question number.
  var count = 1;

  // Keep running the test until testing conditions are no longer valid.
  while (keepTesting) {
    var toAsk = currentTest.getNextQuestion();
    // Ask the question

    askQuestion(toAsk, count);
    count++;

    // Stop if max questions has been exceeded.
    if (count >= config.maxQuestions) {
      keepTesting = false;
    }

    // Stop if ability goes below the threshold.
    if (currentTest.getStudent().getAbility() < config.failureThreshold)
    {
      console.log("Your ability is below the threshold.");
      keepTesting = false;
    }

    // Stop if ability goes above the threshold.
    if (currentTest.getStudent().getAbility() > config.masteryThreshold)
    {
      console.log('Congratulations, you\'ve exceeded the threshold.');
      keepTesting = false;
    }
  }

  // Exit the program
  process.exit(0);
});

