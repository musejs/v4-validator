"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('digits', function() {

    it('should not pass if a value parameter is not specified', function (done) {

        var data = {
            field_1: '123',
            field_2: 123,
            field_3: '123.45',
            field_4: 123.45
        };
        var rules = {
            field_1: 'digits'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.be.instanceOf(Error);
            done();
        });


    });

    it('should pass when the field under validation is numeric and must have an exact length of value', function (done) {

        var data = {
            field_1: '123',
            field_2: 123,
            field_3: '123.45',
            field_4: 123.45
        };
        var rules = {
            field_1: 'digits:3',
            field_2: 'digits:3',
            field_3: 'digits:6',
            field_4: 'digits:6'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation is not numeric and must have an exact length of value', function (done) {

        var data = {
            field_1: '123',
            field_2: 'hello'
        };
        var rules = {
            field_1: 'digits:1',
            field_2: 'digits:5'
        };


        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.have.property('meta');
            err.meta.should.have.property('field_1');
            err.meta.should.have.property('field_2');
            done();
        });

    });
});
