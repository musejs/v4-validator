"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('email', function() {

    it('should pass when the field under validation is formatted as an e-mail address', function (done) {

        var data = {
            field_1: 'shaunpersad@gmail.com'
        };
        var rules = {
            field_1: 'email'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation is not formatted as an e-mail address', function (done) {

        var data = {
            field_1: 'shaunpersad',
            field_2: 'gmail.com',
            field_3: '@gmail.com',
            field_4: '@lksdjf',
            field_5: 'slkdjf@ksldjf'
        };
        var rules = {
            field_1: 'email',
            field_2: 'email',
            field_3: 'email',
            field_4: 'email',
            field_5: 'email'
        };

        var validator = new V4Validator(data, rules);

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

