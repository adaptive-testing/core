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
mongoose.connect(config.db);
var questionDb = require('./question.db');




// Setup the command line I/O
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('❯ ');
rls.setPrompt('❯ ');

//Prompt for name and ability.
var studentName = 'Clay'; //rls.question('What is your name?: ');
var studentAbility = 5; //rls.question('What is your ability? (0 - 10): ');


// Start a test
var currentTest = new Test(studentName, studentAbility);

/**
 * Displays a question for the user.
 */
var askQuestion = function (question, count) {
  'use strict';
  var letter = 'A';
  var questionAnswerMap = {}; // Used to map letter values to actual answers.

  // For the stats shown below
  var studentAbility = currentTest.getStudent().getAbility();
  var percentRange = percentRange || {};
  if (config.demo) {
    percentRange = {
      high: studentAbility * 1.25,
      low: studentAbility * 0.75
    };
  }



  console.log('');
  console.log('Question ' + count + ': ');
  console.log(question.text);
  console.log('\tYour current ability is: ' + studentAbility);
  console.log('\tThis question\'s difficulty is ' + question.difficulty);
  if (config.demo) {
    console.log('\tRange details:');
    console.log('\t\t Ability + 25% = ' + percentRange.high);
    console.log('\t\t Ability - 25% = ' + percentRange.low);
  }
  console.log('\tIt has been asked ' + question.asked + ' times.');
  console.log('\tIt has been answered correctly ' + question.correct + ' times.');


  _.each(question.answers, function (answer){
    questionAnswerMap[letter] = answer.text;
    var correctMarker = '';
    if (config.demo && answer.correct) { correctMarker = '*';}
    console.log(correctMarker + letter + ') ' + answer.text);
    letter = String.fromCharCode(letter.charCodeAt() + 1);
  });
  var value = rls.prompt();
  value = value.toUpperCase();
  while (questionAnswerMap[value] === null || questionAnswerMap[value] === undefined) {
    console.log('\nThat wasn\'t an answer!  Try again.');
    value = rls.prompt();
  }
  console.log(value);

  return currentTest.processResponse(question, questionAnswerMap[value]);
};





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

