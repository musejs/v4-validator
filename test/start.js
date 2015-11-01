"use strict";

describe('V4Validator', function() {

    describe('constructor', function () {

        it('should create a new instance of V4Validator', function () {

            var V4Validator = require('../src/factory')();

            var validator = V4Validator.make();
        });

        it('should create a new instance of V4Validator with custom messages', function (done) {

            var V4Validator = require('../src/factory')();

            var required_message = 'This is required bro.';
            var field_5_required_message = 'This too is required bro.';
            var field_2_string_message = 'Field dos must be a string.';

            var data = {
                field_2: 2,
                field_3: 3
            };

            var rules = {
                field_1: 'required',
                field_2: 'string',
                field_3: 'string',
                field_4: ['required', 'string'],
                field_5: ['required']
            };

            var messages = {
                required: required_message,
                "field_2.string": field_2_string_message,
                "field_5.required": field_5_required_message
            };

            var validator = V4Validator.make(data, rules, messages);

            validator.validate(function(err) {

                err.should.be.ok;
                err.should.have.property('meta');
                err.meta.should.have.property('field_1');
                err.meta.should.have.property('field_2');
                err.meta.should.have.property('field_3');
                err.meta.should.have.property('field_4');
                err.meta.should.have.property('field_5Tes');

                err.meta.field_1[0].message.should.equal(required_message);
                err.meta.field_2[0].message.should.equal(field_2_string_message);
                err.meta.field_3[0].message.should.not.equal(field_2_string_message);
                err.meta.field_4[0].message.should.equal(required_message);
                err.meta.field_4[1].message.should.not.equal(field_2_string_message);
                err.meta.field_5[0].message.should.equal(field_5_required_message);

                done();
            });

        });


    });

    describe('rule', function () {

        it('should provide a new rule to use in validation', function (done) {

            var V4Validator = require('../src/factory')({
                rules: {
                    equals_something: function(data, field, value, parameters, callback) {

                        callback(null, value === 'something');
                    }
                }
            });

            var data = {
                field_1: 'something'
            };
            var rules = {
                field_1: 'equals_something|required'
            };

            var validator = V4Validator.make(data, rules);

            validator.validate(function(err) {

                if (err) {
                    throw err;
                }
                done();
            });
        });

        it('should add a new rule to use in validation', function (done) {

            var V4Validator = require('../src/factory')();

            V4Validator.rule('equals_something', function(data, field, value, parameters, callback) {

                callback(null, value === 'something');
            });

            var data = {
                field_1: 'something'
            };
            var rules = {
                field_1: 'equals_something'
            };

            var validator = V4Validator.make(data, rules);

            validator.validate(function(err) {

                if (err) {
                    throw err;
                }
                done();
            });
        });
    });

    describe('replacer', function () {


        it('should provide a new replacer to use in validation', function (done) {

            var new_text = 'hey, this is wrong.';

            var V4Validator = require('../src/factory')({
                replacers: {
                    required: function(field, constraint) {

                        constraint.message = new_text;
                    }
                }
            });

            var data = {};

            var rules = {
                field_1: 'required'
            };

            var validator = V4Validator.make(data, rules);

            validator.validate(function(err) {

                err.should.be.ok;
                err.should.have.property('meta');
                err.meta.should.have.property('field_1');
                err.meta.field_1[0].message.should.equal(new_text);
                done();
            });
        });

        it('should add a new rule to use in validation', function (done) {

            var new_text = 'hey, this is also wrong.';

            var V4Validator = require('../src/factory')();

            V4Validator.replacer('required', function(field, constraint) {

                constraint.message = new_text;
            });

            var data = {};

            var rules = {
                field_1: 'required'
            };

            var validator = V4Validator.make(data, rules);

            validator.validate(function(err) {

                err.should.be.ok;
                err.should.have.property('meta');
                err.meta.should.have.property('field_1');
                err.meta.field_1[0].message.should.equal(new_text);
                done();
            });
        });
    });

});