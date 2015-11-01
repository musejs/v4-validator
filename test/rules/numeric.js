"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('numeric', function() {

    it('should pass when the field under validation is numeric', function (done) {

        var data = {
            field_1: '1',
            field_2: 1,
            field_3: 12.3
        };
        var rules = {
            field_1: 'numeric',
            field_2: 'numeric',
            field_3: 'numeric'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation is not numeric', function (done) {

        var data = {
            field_1: '1'+'a',
            field_2: 1+'a',
            field_3: 12.3+'a'
        };
        var rules = {
            field_1: 'numeric',
            field_2: 'numeric',
            field_3: 'numeric'
        };


        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.have.property('meta');
            err.meta.should.have.property('field_1');
            err.meta.should.have.property('field_2');
            err.meta.should.have.property('field_3');
            done();
        });

    });
});

