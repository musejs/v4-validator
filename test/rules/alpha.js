"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('alpha', function() {

    it('should pass when the field under validation is entirely alphabetic characters', function (done) {

        var data = {
            field_1: 'klsdjflk'
        };
        var rules = {
            field_1: 'alpha'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });

    });
    it('should not pass if the field under validation is not entirely alphabetic characters', function (done) {


        var data = {
            field_1: 'klsdjflk',
            field_2: 'skdjflksdj123',
            field_3: 123
        };
        var rules = {
            field_1: 'alpha',
            field_2: 'alpha',
            field_3: 'alpha'
        };

        var validator = V4Validator.make(data, rules);

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

