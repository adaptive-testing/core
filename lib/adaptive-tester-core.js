/*
 * adaptive-tester-core
 * user/repo
 *
 * Copyright (c) 2014 Clay Diffrient
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function () {
    // Holds the questions
    var questions = [];

    var getTotalQuestions = function () {
        return questions.length;
    };



    return {
        getTotalQuestions: getTotalQuestions
    }
};



