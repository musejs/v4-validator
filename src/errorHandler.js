"use strict";

var ValidationError = require('./ValidationError');

module.exports = function(errors) {

    return new ValidationError(null, errors);
};