"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('in', function() {

    it('should not pass if a parameters are not specified', function (done) {

        var data = {
            field_1: 'hello'
        };
        var rules = {
            field_1: 'in'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.be.instanceOf(Error);
            done();
        });


    });


    it('should pass when the field under validation is included in the given list of values', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 'hello'
        };
        var rules = {
            field_1: 'in:hello,hey,hi',
            field_2: 'in:hello'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation is not included in the given list of values', function (done) {

        var data = {
            field_1: 'hola'
        };
        var rules = {
            field_1: 'in:hello,hey,hi'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.have.property('meta');
            err.meta.should.have.property('field_1');
            done();
        });

    });
});

