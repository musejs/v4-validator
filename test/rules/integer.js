"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('integer', function() {

    it('should pass when the field under validation is an integer', function (done) {

        var data = {
            field_1: '1',
            field_2: 1,
            field_3: '2'
        };
        var rules = {
            field_1: 'integer',
            field_2: 'integer',
            field_3: 'integer:true'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            data.field_3.should.be.instanceOf(Number);
            done();
        });
    });

    it('should not pass if the field under validation is not an integer', function (done) {

        var data = {
            field_1: '1sdf',
            field_2: 1.5,
            field_3: 'ksdjflk'
        };
        var rules = {
            field_1: 'integer',
            field_2: 'integer',
            field_3: 'integer'
        };

        var validator = V4Validator.make(data, rules);

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

