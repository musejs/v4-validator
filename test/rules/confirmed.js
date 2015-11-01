"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('confirmed', function() {

    it('should pass when the field under validation has a matching field of foo_confirmation. For example, if the field under validation is password, a matching password_confirmation field must be present in the input', function (done) {

        var data = {
            field_1: 'hello',
            field_1_confirmation: 'hello'
        };
        var rules = {
            field_1: 'confirmed'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation does not have a matching field of foo_confirmation. For example, if the field under validation is password, a matching password_confirmation field must be present in the input', function (done) {

        var data = {
            field_1: 'hello',
            field_1_confirmation: 'hello',
            field_2: 'hi',
            field_2_confirmation: 'hey',
            field_3: 'sup'
        };
        var rules = {
            field_1: 'confirmed',
            field_2: 'confirmed',
            field_3: 'confirmed'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.have.property('meta');
            err.meta.should.have.property('field_2');
            err.meta.should.have.property('field_3');
            err.meta.should.not.have.property('field_1');
            done();
        });

    });
});

