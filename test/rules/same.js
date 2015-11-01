"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('same', function() {

    it('should not pass if a same parameter is not specified', function (done) {

        var data = {
            field_1: 'hello'
        };
        var rules = {
            field_1: 'same'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.be.instanceOf(Error);
            done();
        });

    });


    it('should pass when the field under validation matches the given field', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 'hello'
        };
        var rules = {
            field_1: 'same:field_2'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation does not match the given field', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 'hi'
        };
        var rules = {
            field_1: 'same:field_2'
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

