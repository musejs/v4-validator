"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('array', function() {

    it('should pass when the field under validation is an array', function (done) {

        var data = {
            field_1: ['hey'],
            field_2: []
        };
        var rules = {
            field_1: 'array',
            field_2: 'array'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation is not an array', function (done) {

        var data = {
            field_1: ['hey'],
            field_2: [],
            field_3: 'hey'
        };
        var rules = {
            field_1: 'array',
            field_2: 'array',
            field_3: 'array'
        };
        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.have.property('meta');
            err.meta.should.not.have.property('field_1');
            err.meta.should.not.have.property('field_2');
            err.meta.should.have.property('field_3');
            done();
        });

    });
});

