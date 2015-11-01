"use strict";

var _ = require('lodash');
var fileType = require('file-type');
var http = require('http');
var moment = require('moment-timezone');
var mmm = require('mmmagic');
var Magic = mmm.Magic;
var mime = require('mime');
var path = require('path');
var request = require('request');


var alpha = /^[A-Za-z]+$/;
var alpha_num = /^[a-z0-9]+$/i;
var alpha_num_dash = /^[a-zA-Z0-9-_]+$/;
var valid_url = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

function isNumeric(value) {

    return !isNaN(parseFloat(value)) && isFinite(value);
}

function isIPAddress(value) {

    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value);
}

function isIn(field, value, values) {

    if (_.isPlainObject(values)) {

        return values[field] !== undefined;
    }

    if (_.isArray(values)) {

        return values.indexOf(value) !== -1;
    }
    return false;
}

function isRequired(value) {

    if (_.isNull(value)) {
        return false;
    } else if(_.isString(value) && value === '') {
        return false;
    } else if (_.isArray(value) && value.length < 1) {
        return false;
    } else if (_.isUndefined(value)) {
        return false;
    }
    return !!value;
}

function getSize(value) {

    if (value.length || value.length === 0) {
        return value.length;
    }
    value = value || 0;
    return value;
}


module.exports = {
    /**
     * The field under validation must be yes, on, 1, or true.
     *
     * This is useful for validating "Terms of Service" acceptance.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    accepted: function(data, field, value, parameters, callback) {

        var result = value == '1' || value == 1 || value == 'yes' || value == 'on' || value == true || value == 'true';
        callback(null, result);
    },
    /**
     * The field under validation must be a valid URL by sending a HEAD request.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    active_url: function(data, field, value, parameters, callback) {

        request(value, {method: 'HEAD'}, function (err, res, body){

            if (err) {
                return callback(null, false);
            }
            callback(null, true);
        });
    },
    /**
     * The field under validation must be a value after a given date.
     *
     * The dates will be passed into moment.js
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    after: function(data, field, value, parameters, callback) {

        if (!parameters.length) {
            return callback(new Error('The date parameter is required.'));
        }

        callback(null, moment(new Date(value)).isAfter(parameters[0]));
    },
    /**
     * The field under validation must be entirely alphabetic characters.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    alpha: function(data, field, value, parameters, callback) {

        if (_.isString(value)) {

            return callback(null, alpha.test(value));
        }
        callback(null, false);
    },
    /**
     * The field under validation may have alpha-numeric characters, as well as dashes and underscores.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    alpha_num_dash: function(data, field, value, parameters, callback) {

        if (_.isString(value)) {

            return callback(null, alpha_num_dash.test(value));
        }
        callback(null, false);
    },
    /**
     * The field under validation must be entirely alpha-numeric characters.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    alpha_num: function(data, field, value, parameters, callback) {

        if (isNumeric(value)) {
            return callback(null, true);
        }

        if (_.isString(value)) {

            return callback(null, alpha_num.test(value));
        }
        callback(null, false);

    },
    /**
     * The field under validation must be an array.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    array: function(data, field, value, parameters, callback) {

        return callback(null, _.isArray(value));
    },
    /**
     * The field under validation must be a value preceding the given date.
     *
     * The dates will be passed into moment.js.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    before: function(data, field, value, parameters, callback) {

        if (!parameters.length) {
            return callback(new Error('The date parameter is required.'));
        }

        callback(null, moment(new Date(value)).isBefore(parameters[0]));
    },
    /**
     * The field under validation must have a size between the given min and max.
     *
     * Strings, numerics, and files are evaluated in the same fashion as the size rule.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    between: function(data, field, value, parameters, callback) {

        if (parameters.length != 2) {
            return callback(new Error('The min and max parameters are required.'));
        }

        var size = getSize(value);

        return callback(null, size >= Number(parameters[0]) && size <= Number(parameters[1]));
    },
    /**
     * The field under validation must be able to be cast as a boolean.
     *
     * Accepted input are true, false, 1, 0, "1", and "0"
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    boolean: function(data, field, value, parameters, callback) {

        if (value == true || value == 'true' || value == 1 || value == '1') {

            data[field] = true;
            return callback(null, true);

        } else if (value == false || value == 'false' || value == 0 || value == '0') {

            data[field] = false;
            return callback(null, true);
        }
        callback(null, false);
    },
    /**
     * The field under validation must have a matching field of foo_confirmation.
     *
     * For example, if the field under validation is password,
     * a matching password_confirmation field must be present in the input.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    confirmed: function(data, field, value, parameters, callback) {

        callback(null, !!(data[field + '_confirmation'] && data[field + '_confirmation'] == value));
    },
    /**
     * The field under validation must be a valid date according to moment.js.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    date: function(data, field, value, parameters, callback) {

        var is_date = false;
        try {

            is_date = moment(new Date(value)).isValid();

        } catch(e) {

        }

        callback(null, is_date);
    },
    /**
     * The field under validation must match the given format.
     *
     * The format will be evaluated using moment.js.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    date_format: function(data, field, value, parameters, callback) {

        if (!parameters.length) {
            return callback(new Error('The format parameter is required.'));
        }

        var format = parameters.join(',');

        callback(null, moment(value, format, true).isValid());
    },
    /**
     * The field under validation must have a different value than field.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    different: function(data, field, value, parameters, callback) {

        if (!arguments.length) {
            return callback(new Error('The other field is required.'));
        }

        callback(null, !!(data[parameters[0]] && data[parameters[0]] != value));
    },
    /**
     * The field under validation must be numeric and must have an exact length of value.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    digits: function(data, field, value, parameters, callback) {

        if (!arguments.length) {
            return callback(new Error('The digits parameter is required.'));
        }

        callback(null, isNumeric(value) && (value + '').length == parameters[0]);
    },
    /**
     * The field under validation must have a length between the given min and max.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    digits_between: function(data, field, value, parameters, callback) {

        if (parameters.length != 2) {
            return callback(new Error('The min and max parameters are required.'));
        }

        var length = isNumeric(value) && (value + '').length;

        callback(null, length >= parseInt(parameters[0]) && length <= parseInt(parameters[1]));
    },
    /**
     * The field under validation must be formatted as an e-mail address.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    email: function(data, field, value, parameters, callback) {

        var tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/;
        callback(null, tester.test(value));
    },

    exists: function(data, field, value, parameters, callback) {

        if (!DB) {
            return callback(new Error('No database given.'));
        }

        callback(null, false); //TODO
    },
    /**
     * The file under validation must be an image (jpeg, png, bmp, gif, or svg)
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    image: function(data, field, value, parameters, callback) {

        if (_.startsWith(value, 'http')) {

            return http.get(value, res => {
                res.on('error', function() {
                    callback(null, false);
                });
                res.once('data', chunk => {

                    res.destroy();
                    var result = fileType(chunk);

                    if (_.startsWith(result.mime, 'image/')) {

                        return callback(null, true);
                    }

                    var extension = path.extname(value);
                    if (['jpg', 'jpeg', 'png', 'bmp', 'gif', 'svg'].indexOf(extension.replace('.', '')) !== -1) {
                        return callback(null, true);
                    }

                    callback(null, false);
                });
            });

        }

        var magic = new Magic(mmm.MAGIC_MIME_TYPE);
        magic.detectFile(value, function(err, type) {

            if (err) {

                return callback(null, false);
            }
            if (_.startsWith(type, 'image/')) {

                return callback(null, true);
            }
            callback(null, false);
        });
    },
    /**
     * The field under validation must be included in the given list of values.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    in: function(data, field, value, parameters, callback) {

        if (!parameters.length) {
            return callback(new Error('The values parameter is required.'));
        }

        callback(null, isIn(field, value, parameters));
    },
    /**
     * The field under validation must be an integer.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    integer: function(data, field, value, parameters, callback) {

        callback(null, isNumeric(value) && parseInt(value, 10) == value);
    },
    /**
     * The field under validation must be an IP address.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    ip: function(data, field, value, parameters, callback) {

        callback(null, isIPAddress(value));
    },
    /**
     * The field under validation must a valid JSON string.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     * @returns {*}
     */
    json: function(data, field, value, parameters, callback) {

        try {
            JSON.parse(value);
        }
        catch(e) {
            return callback(null, false);
        }
        callback(null, true);
    },
    /**
     * The field under validation must be less than or equal to a maximum value.
     *
     * Strings, numerics, and files are evaluated in the same fashion as the size rule.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    max: function(data, field, value, parameters, callback) {

        if (!parameters.length) {
            return callback(new Error('The max parameter is required.'));
        }

        callback(null, getSize(value) <= parameters[0]);
    },
    /**
     * The file under validation must have a MIME type corresponding to one of the listed extensions.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    mimes: function(data, field, value, parameters, callback) {

        if (!parameters.length) {
            return callback(new Error('The file extensions to check against are required.'));
        }

        validateMimes(value, parameters, callback);
    },
    /**
     * The field under validation must have a minimum value.
     *
     * Strings, numerics, and files are evaluated in the same fashion as the size rule.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    min: function(data, field, value, parameters, callback) {

        if (!parameters.length) {
            return callback(new Error('The min parameter is required.'));
        }

        callback(null, getSize(value) >= parameters[0]);
    },
    /**
     * The field under validation must not be included in the given list of values.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    not_in: function(data, field, value, parameters, callback) {

        callback(null, !isIn(field, value, parameters));
    },
    /**
     * The field under validation must be numeric.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    numeric: function(data, field, value, parameters, callback) {

        callback(null, isNumeric(value));
    },
    /**
     * The field under validation must match the given regular expression.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    regex: function(data, field, value, parameters, callback) {

        if (!parameters.length) {
            return callback(new Error('The regex is required.'));
        }

        if (_.isString(parameters[0])) {
            parameters[0] = new RegExp(parameters[0]);
        }

        callback(null, parameters[0].test(value));
    },
    /**
     * The field under validation must be present in the input data.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    required: function(data, field, value, parameters, callback) {

        callback(null, isRequired(value));
    },
    /**
     * The field under validation must be present if the another_field field is equal to any value.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    required_if: function(data, field, value, parameters, callback) {

        if (parameters.length < 2) {
            return callback(new Error('The other field and other value(s) are required.'));
        }

        var other_field = data[parameters[0]];
        for(var x = 0; x < parameters.length; x++) {
            if (x) {
                if (other_field == parameters[x] && isRequired(value)) {

                    return callback(null, true);
                }
            }
        }
        callback(null, false);

    },
    /**
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    required_with: function(data, field, value, parameters, callback) {

        if (!parameters.length) {
            return callback(new Error('The other fields are required.'));
        }
        for (var x = 0; x < parameters.length; x++) {

            if (isRequired(data[parameters[x]]) && isRequired(value)) {
                return callback(null, true);
            }
        }
        callback(null, false);
    },
    /**
     * The field under validation must be present only if all of the other specified fields are present.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    required_with_all: function(data, field, value, parameters, callback) {

        if (!parameters.length) {
            return callback(new Error('The other fields are required.'));
        }
        for (var x = 0; x < parameters.length; x++) {

            if (!isRequired(data[parameters[x]])) {
                return callback(null, false);
            }
        }
        callback(null, isRequired(value));
    },
    /**
     * The field under validation must be present only when any of the other specified fields are not present.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    required_without: function(data, field, value, parameters, callback) {

        if (!parameters.length) {
            return callback(new Error('The other fields are required.'));
        }
        for (var x = 0; x < parameters.length; x++) {

            if (!isRequired(data[parameters[x]]) && isRequired(value)) {
                return callback(null, true);
            }
        }
        callback(null, false);
    },
    /**
     * The field under validation must be present only when all of the other specified fields are not present.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    required_without_all: function(data, field, value, parameters, callback) {

        if (!parameters.length) {
            return callback(new Error('The other fields are required.'));
        }
        for (var x = 0; x < parameters.length; x++) {

            if (isRequired(data[parameters[x]])) {
                return callbak(null, false);
            }
        }
        callback(null, isRequired(value));
    },
    /**
     * The given field must match the field under validation.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    same: function(data, field, value, parameters, callback) {

        if (!parameters.length) {
            return callback(new Error('The other field is required.'));
        }

        callback(null, value == data[parameters[0]]);
    },
    /**
     * The field under validation must have a size matching the given value.
     *
     * For string data, value corresponds to the number of characters.
     * For numeric data, value corresponds to a given integer value.
     * For files, size corresponds to the file size in kilobytes.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    size: function(data, field, value, parameters, callback) {

        if (!parameters.length) {
            return callback(new Error('The size is required.'));
        }

        callback(null, getSize(value) == parameters[0]);
    },
    /**
     * The field under validation must be a string.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    string: function(data, field, value, parameters, callback) {

        callback(null, _.isString(value));
    },

    /**
     * The field under validation must be a valid timezone identifier according to moment.js.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    timezone: function(data, field, value, parameters, callback) {

        callback(null, moment().tz(value).isValid());
    },

    /**
     * The field under validation must be a valid URL according to PHP's filter_var function.
     *
     * @param data
     * @param field
     * @param value
     * @param parameters
     * @param callback
     */
    url: function(data, field, value, parameters, callback) {

        if (value) {

            return callback(null, valid_url.test( value ));
        }
        callback(null, false);
    }
};