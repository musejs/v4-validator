"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('size', function() {

    it('should not pass if a size parameter is not specified', function (done) {

        var data = {
            field_1: 'hello'
        };
        var rules = {
            field_1: 'size'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.be.instanceOf(Error);
            done();
        });

    });


    it('should pass when the field under validation must have a size matching the given value. For string data, value corresponds to the number of characters. For numeric data, value corresponds to a given integer value. For files, size corresponds to the file size in kilobytes.', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 5,
            field_3: ['one', 'two', 'three', 'four', 'five']
        };
        var rules = {
            field_1: 'size:5',
            field_2: 'size:5',
            field_3: 'size:5'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation does not have a size matching the given value. For string data, value corresponds to the number of characters. For numeric data, value corresponds to a given integer value. For files, size corresponds to the file size in kilobytes.', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 5,
            field_3: ['one', 'two', 'three', 'four', 'five']
        };
        var rules = {
            field_1: 'size:4',
            field_2: 'size:6',
            field_3: 'size:7'
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
