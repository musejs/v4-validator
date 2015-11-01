"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('string', function() {

    it('should pass when the field under validation is a string', function (done) {

        var data = {
            field_1: '1',
            field_2: 'hello'
        };
        var rules = {
            field_1: 'string',
            field_2: 'string'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation is not an integer', function (done) {

        var data = {
            field_1: true,
            field_2: 1.5,
            field_3: false,
            field_4: null,
            field_5: undefined
        };
        var rules = {
            field_1: 'string',
            field_2: 'string',
            field_3: 'string',
            field_4: 'string',
            field_5: 'string'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.have.property('meta');
            err.meta.should.have.property('field_1');
            err.meta.should.have.property('field_2');
            err.meta.should.have.property('field_3');
            err.meta.should.have.property('field_4');
            err.meta.should.have.property('field_5');

            done();
        });

    });
});
