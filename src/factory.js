"use strict";
var _ = require('lodash');
var async = require('async');
var default_replacer = Symbol('default_replacer');

module.exports = function factory(config, errorHandler, DB) {


    var messages = _.clone(require('./messages'), true);
    var rules = _.clone(require('./rules'), true);
    var replacers = _.clone(require('./replacers'), true);

    /**
     * Setup defaults.
     */
    if (!config) {
        config = {};
    }

    _.defaultsDeep(config, {
        messages: messages,
        rules: rules,
        replacers: replacers
    });

    config.replacers[default_replacer] = function(field, constraint) {

        var attribute = new RegExp(':attribute', 'g');

        constraint.message = constraint.message
            .replace(attribute, _.snakeCase(field).split('_').join(' '));
    };

    /**
     * This function creates an error object.
     */
    if (!errorHandler) {

        errorHandler = require('./errorHandler');
    }

    return class V4Validator {

        /**
         * Setup.
         *
         * @param data
         * @param rules
         * @param messages
         */
        constructor(data, rules, messages) {

            this._data = data || {};
            this._rules = rules || {};
            this._messages = messages || {};
            this._sometimes = {};
            this._errors = null;
        }

        addConditionalRules(data) {

            for (var field in this._sometimes) {

                if (this._sometimes[field].condition(data)) {

                    this._rules[field] = this._sometimes[field].rules;
                }
            }
        }

        /**
         * Validate the data supplied.
         *
         * @param callback
         * @returns {*}
         */
        validate(callback) {

            var validator = this;
            var data = this._data;
            var errors = this._errors;

            this.addConditionalRules(data);

            var schema = this.schema();
            var fields = Object.keys(schema);

            if (!fields.length) {

                return callback(null, data);
            }

            async.each(fields, function(field, callback) {

                async.eachSeries(schema[field], function(constraint, callback2) {

                    var fn = config.rules[constraint.rule];

                    if (!fn) {
                        var err = new Error('A check for the rule '+constraint.rule+' does not exist.');
                        return callback(err);
                    }

                    var value = constraint.value;
                    var args = constraint.args;

                    fn(data, field, value, args, function(err, result) {

                        if (err) {
                            return callback(err);
                        }

                        if (!result) {

                            if (!errors) {
                                errors = {};
                            }
                            if (!errors[field]) {
                                errors[field] = [];
                            }
                            errors[field].push(validator.constructor.parseMessage(field, constraint));
                        }

                        callback2();
                    });

                }, callback);

            }, function(err) {

                if (!err && errors) {

                    err = errorHandler(errors);
                }
                callback(err, data);

            });
        }

        /**
         * Conditionally add rules for a field.
         *
         * @param field
         * @param rules
         * @param closure
         */
        sometimes(field, rules, closure) {

            if (_.isString(field)) {
                field = [field];
            }

            for(var u = 0, len = field.length; u < len; u++) {

                var f = field[u];

                this._sometimes[f] = {
                    rules: rules,
                    condition: closure
                };
            }
        }

        /**
         * Returns the errors.
         *
         * @returns {null}
         */
        failed() {

            return this._errors;
        }

        /**
         * Creates a schema of fields to their rules, value in the data, arguments, and error message.
         *
         * @returns {{}}
         */
        schema() {

            var validation_messages = config.messages;

            var schema = {};

            for (var field in this._rules) {

                schema[field] = [];

                var field_rules = this._rules[field];

                if (_.isString(field_rules)) {

                    field_rules = field_rules.split('|');
                }

                for(var u = 0, len = field_rules.length; u < len; u++) {

                    var rule = field_rules[u];

                    rule = _.trim(rule);

                    if (rule == 'sometimes') {

                        if (this._data[field] === undefined) {
                            break;
                        }

                    } else {

                        var args = rule.split(':');
                        rule = _.trim(args.shift());
                        args = _.trim(args.join(':'));
                        if (args.length) {
                            args = args.split(',');
                        }
                        args = args || [];

                        var value = undefined;
                        if (this._data[field] !== undefined) {
                            value = this._data[field];
                        }

                        var message = undefined;
                        if (this._messages[field+'.'+rule]) {

                            message = this._messages[field+'.'+rule];

                        } else if (this._messages[rule]) {

                            message = this._messages[rule];

                        } else if (validation_messages[rule]) {

                            message = validation_messages[rule];

                            if (!_.isString(message)) {

                                if (_.isString(value)) {
                                    message = message['string'];
                                } else if (_.isArray(value)) {
                                    message = message['array'];
                                } else if (_.isNumber(value)) {
                                    message = message['numeric'];
                                } else {
                                    message = message['file'];
                                }
                            }
                        }

                        schema[field].push({
                            rule: rule,
                            value: value,
                            args: args,
                            message: message
                        });

                    }
                }
            }

            return schema;
        }

        /**
         * Replaces the placeholders with their appropriate values in the error message.
         *
         * @param field
         * @param constraint
         * @returns {*}
         */
        static parseMessage(field, constraint) {

            config.replacers[default_replacer](field, constraint);

            if (config.replacers[constraint.rule]) {
                config.replacers[constraint.rule](field, constraint);
            }

            return constraint;
        }

        static make(data, rules, messages) {

            return new this(data, rules, messages);
        }

        /**
         * Add new rules.
         *
         * @param rule
         * @param closure
         */
        static rule(rule, closure) {

            config.rules[rule] = closure;
        }

        /**
         * Add new replacers.
         *
         * @param rule
         * @param closure
         */
        static replacer(rule, closure) {

            config.replacers[rule] = closure;
        }

        /**
         * Returns the Symbol used to key the default replacer.
         *
         * @returns {Symbol}
         */
        static defaultReplacer() {
            return default_replacer;
        }

    }
};