"use strict";
var _ = require('lodash');

var regexes = {};

function getPlaceholderRegex(placeholder) {

    if (regexes[placeholder]) {
        return regexes[placeholder];
    }
    regexes[placeholder] = new RegExp(':'+placeholder, 'g');
    return regexes[placeholder];
}

module.exports = {
    "after": function(field, constraint) {

        var attribute = getPlaceholderRegex('attribute');
        var date = getPlaceholderRegex('date');

        constraint.message = constraint.message
            .replace(attribute, _.snakeCase(field).split('_').join(' '))
            .replace(date, constraint.args[0]);
    },
    "before": function(field, constraint) {

        var attribute = getPlaceholderRegex('attribute');
        var date = getPlaceholderRegex('date');

        constraint.message = constraint.message
            .replace(attribute, _.snakeCase(field).split('_').join(' '))
            .replace(date, constraint.args[0]);
    },
    "between": function(field, constraint) {

        var attribute = getPlaceholderRegex('attribute');
        var min = getPlaceholderRegex('min');
        var max = getPlaceholderRegex('max');

        constraint.message = constraint.message
            .replace(attribute, _.snakeCase(field).split('_').join(' '))
            .replace(min, constraint.args[0])
            .replace(max, constraint.args[1]);
    },
    "date_format": function(field, constraint) {

        var attribute = getPlaceholderRegex('attribute');
        var format = getPlaceholderRegex('format');

        constraint.message = constraint.message
            .replace(attribute, _.snakeCase(field).split('_').join(' '))
            .replace(format, constraint.args[0]);
    },
    "different": function(field, constraint) {

        var attribute = getPlaceholderRegex('attribute');
        var other = getPlaceholderRegex('other');

        constraint.message = constraint.message
            .replace(attribute, _.snakeCase(field).split('_').join(' '))
            .replace(other, constraint.args[0]);
    },
    "digits": function(field, constraint) {

        var attribute = getPlaceholderRegex('attribute');
        var digits = getPlaceholderRegex('digits');

        constraint.message = constraint.message
            .replace(attribute, _.snakeCase(field).split('_').join(' '))
            .replace(digits, constraint.args[0]);
    },
    "digits_between": function(field, constraint) {

        var attribute = getPlaceholderRegex('attribute');
        var min = getPlaceholderRegex('min');
        var max = getPlaceholderRegex('max');

        constraint.message = constraint.message
            .replace(attribute, _.snakeCase(field).split('_').join(' '))
            .replace(min, constraint.args[0])
            .replace(max, constraint.args[1]);
    },
    "max": function(field, constraint) {

        var attribute = getPlaceholderRegex('attribute');
        var max = getPlaceholderRegex('max');

        constraint.message = constraint.message
            .replace(attribute, _.snakeCase(field).split('_').join(' '))
            .replace(max, constraint.args[0]);
    },
    "mimes": function(field, constraint) {

        var attribute = getPlaceholderRegex('attribute');
        var values = getPlaceholderRegex('values');

        constraint.message = constraint.message
            .replace(attribute, _.snakeCase(field).split('_').join(' '))
            .replace(values, constraint.args.join(', '));
    },
    "min": function(field, constraint) {

        var attribute = getPlaceholderRegex('attribute');
        var min = getPlaceholderRegex('min');

        constraint.message = constraint.message
            .replace(attribute, _.snakeCase(field).split('_').join(' '))
            .replace(min, constraint.args[0]);
    },
    "required_if": function(field, constraint) {

        var values = [];
        for(var x = 0; x < constraint.args.length; x++) {

            if (x) {
                values.push(constraint.args[x]);
            }
        }
        var attribute = getPlaceholderRegex('attribute');
        var other = getPlaceholderRegex('other');
        var value = getPlaceholderRegex('value');

        constraint.message = constraint.message
            .replace(attribute, _.snakeCase(field).split('_').join(' '))
            .replace(other, constraint.args[0])
            .replace(value, values.join(', '));
    },
    "required_with": function(field, constraint) {

        var attribute = getPlaceholderRegex('attribute');
        var values = getPlaceholderRegex('values');

        constraint.message = constraint.message
            .replace(attribute, _.snakeCase(field).split('_').join(' '))
            .replace(values, constraint.args.join(', '));
    },
    "required_with_all": function(field, constraint) {

        var attribute = getPlaceholderRegex('attribute');
        var values = getPlaceholderRegex('values');

        constraint.message = constraint.message
            .replace(attribute, _.snakeCase(field).split('_').join(' '))
            .replace(values, constraint.args.join(', '));
    },
    "required_without": function(field, constraint) {

        var attribute = getPlaceholderRegex('attribute');
        var values = getPlaceholderRegex('values');

        constraint.message = constraint.message
            .replace(attribute, _.snakeCase(field).split('_').join(' '))
            .replace(values, constraint.args.join(', '));
    },
    "required_without_all": function(field, constraint) {

        var attribute = getPlaceholderRegex('attribute');
        var values = getPlaceholderRegex('values');

        constraint.message = constraint.message
            .replace(attribute, _.snakeCase(field).split('_').join(' '))
            .replace(values, constraint.args.join(', '));
    },
    "same": function(field, constraint) {

        var attribute = getPlaceholderRegex('attribute');
        var other = getPlaceholderRegex('other');

        constraint.message = constraint.message
            .replace(attribute, _.snakeCase(field).split('_').join(' '))
            .replace(other, constraint.args[0]);
    },
    "size": function(field, constraint) {

        var attribute = getPlaceholderRegex('attribute');
        var size = getPlaceholderRegex('size');

        constraint.message = constraint.message
            .replace(attribute, _.snakeCase(field).split('_').join(' '))
            .replace(size, constraint.args[0]);
    }
};