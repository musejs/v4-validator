"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('digits_between', function() {

    it('should not pass if a min parameter is not specified', function (done) {

        var data = {
            field_1: '123',
            field_2: 123,
            field_3: '123.45',
            field_4: 123.45
        };
        var rules = {
            field_1: 'digits'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.be.instanceOf(Error);
            done();
        });
    });

    it('should not pass if a max parameter is not specified', function (done) {

        var data = {
            field_1: '123',
            field_2: 123,
            field_3: '123.45',
            field_4: 123.45
        };
        var rules = {
            field_1: 'digits_between:1'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.be.instanceOf(Error);
            done();
        });
    });

    it('should pass when the field under validation is numeric and has a length between the given min and max', function (done) {

        var data = {
            field_1: '123',
            field_2: 123,
            field_3: '123.45',
            field_4: 123.45
        };
        var rules = {
            field_1: 'digits_between:2,4',
            field_2: 'digits_between:3,4',
            field_3: 'digits_between:5,6',
            field_4: 'digits_between:4,7'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation is not numeric and has a length between the given min and max', function (done) {

        var data = {
            field_1: '123',
            field_2: 'hello',
            field_3: '123',
            field_4: '123'

        };
        var rules = {
            field_1: 'digits_between:6,7',
            field_2: 'digits_between:5,6',
            field_3: 'digits_between:1,2',
            field_4: 'digits_between:0,2'
        };


        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.have.property('meta');
            err.meta.should.have.property('field_1');
            err.meta.should.have.property('field_2');
            err.meta.should.have.property('field_3');
            err.meta.should.have.property('field_4');

            done();
        });

    });
});

