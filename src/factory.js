"use strict";
var _ = require('lodash');
var async = require('async');
var default_replacer = Symbol('default_replacer');

module.exports = function factory(config) {


    var messages = _.clone(require('./messages'), true);
    var rules = _.clone(require('./rules'), true);
    var replacers = _.clone(require('./replacers'), true);
    var errorHandler = require('./errorHandler');
    /**
     * Setup defaults.
     */
    if (!config) {
        config = {};
    }

    _.defaultsDeep(config, {
        messages: messages,
        rules: rules,
        replacers: replacers,
        errorHandler: errorHandler,
        DB: null
    });

    config.replacers[default_replacer] = function(field, constraint) {

        var attribute = new RegExp(':attribute', 'g');

        constraint.message = constraint.message
            .replace(attribute, _.snakeCase(field).split('_').join(' '));
    };

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

                    err = config.errorHandler(errors);
                }
                callback(err, data);

            });
        }

        /**
         * Conditionally add rules for a field.
         *
         * @param field
         * @param rules
         * @param condition
         */
        sometimes(field, rules, condition) {

            if (_.isString(field)) {
                field = [field];
            }

            for(var u = 0, len = field.length; u < len; u++) {

                var f = field[u];

                this._sometimes[f] = {
                    rules: rules,
                    condition: condition
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

                var field_rules = _.get(this._rules, field);
                var value = _.get(this._data, field);

                if (_.isString(field_rules)) {

                    field_rules = field_rules.split('|');
                }

                if (!_.isArray(field_rules)) {
                    field_rules = [field_rules];
                }

                for(var u = 0, len = field_rules.length; u < len; u++) {

                    var field_rule = field_rules[u];
                    var rule = undefined;
                    var args = [];

                    if (_.isString(field_rule)) {

                        args = field_rule.split(':');
                        rule = _.trim(args.shift());
                        args = _.trim(args.join(':'));

                    } else if (_.isPlainObject(field_rule)) {
                        rule = field_rule.rule;
                        args = field_rule.args || [];
                    }

                    if (_.isString(args)) {
                        if (args.length) {
                            args = _.map(args.split(','), _.trim);
                        }
                    }

                    if (rule == 'sometimes') {

                        if (value === undefined) {
                            break;
                        }

                    } else {

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
                            args: args || [],
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

        static factoryConfig() {

            return config;
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
        static defaultReplacerKey() {

            return default_replacer;
        }

        /**
         * Sets a new error handler.
         *
         * @param closure
         */
        static errorHandler(closure) {

            config.errorHandler = closure;
        }

    }
};