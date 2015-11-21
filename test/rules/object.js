"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('object', function() {

    it('should pass when the field under validation is a plain object', function (done) {

        var data = {
            field_1: {
                field_2: 'hello'
            },
            field_3: {}
        };
        var rules = {
            field_1: 'object',
            field_3: 'object'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation is not an object', function (done) {

        var data = {
            field_1: {
                field_2: 'hello'
            },
            field_3: []
        };
        var rules = {
            field_1: 'object',
            field_3: 'object'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.have.property('meta');
            err.meta.should.not.have.property('field_1');
            err.meta.should.have.property('field_3');
            done();
        });

    });
});
