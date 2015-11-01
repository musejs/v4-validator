"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('regex', function() {

    it('should not pass if a regex parameter is not specified', function (done) {

        var data = {
            field_1: '123',
            field_2: 123,
            field_3: 'abc123'
        };
        var rules = {
            field_1: 'regex'

        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.be.instanceOf(Error);
            done();
        });


    });

    it('should pass when the field under validation matches the given regular expression', function (done) {

        var data = {
            field_1: '123',
            field_2: 123,
            field_3: 'abc123',
            field_4: 'abc123'
        };
        var rules = {
            field_1: 'regex:^[a-z0-9]+$,i',
            field_2: 'regex:^[a-z0-9]+$,i',
            field_3: 'regex:^[a-z0-9]+$,i',
            field_4: 'regex:^[a-z0-9]+$'

        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation does not match the given regular expression', function (done) {

        var data = {
            field_1: '123_',
            field_2: 123.45,
            field_3: 'abc_123'
        };
        var rules = {
            field_1: 'regex:^[a-z0-9]+$,i',
            field_2: 'regex:^[a-z0-9]+$,i',
            field_3: 'regex:^[a-z0-9]+$,i'

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

