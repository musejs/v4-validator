"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('timezone', function() {

    it('should pass when the field under validation is a valid timezone identifier according to moment.js', function (done) {

        var data = {
            field_1: 'America/New_York'
        };
        var rules = {
            field_1: 'timezone'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation is not a valid timezone identifier according to moment.js', function (done) {

        var data = {
            field_1: 'new york'
        };
        var rules = {
            field_1: 'timezone'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.have.property('meta');
            err.meta.should.have.property('field_1');
            done();
        });

    });
});

