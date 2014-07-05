/**
 * Created by clay on 7/4/14.
 */

var mongoose = require('mongoose');
var config = require('./config');
var db = mongoose.connect(config.db);
var questionDb = require('./question.db');
var util = require('util');


function makeid()
{
  'use strict';
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for( var i=0; i < 5; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}


var generateQuestion = function (difficulty) {
  'use strict';
  var question = {};
  question.text = 'Choose the correct answer. ' + makeid();
  question.answers = [{
    text: 'Correct', correct: true
  },{text: 'Incorrect', correct: false}];
  question.difficulty = difficulty;
  return question;
};

var questions = [];

for (var i = 0; i <= 10; i = i + 0.25) {
  for (var count = 0; count < 10; count++)
  {
    questions.push(generateQuestion(i)); //new questionDb(generateQuestion(i));
//    question.save(function (err){
//      "use strict";
//      if (err) console.log(err);
//    });
  }
}

console.log(util.inspect(questions, false, null));

process.exit(0);
