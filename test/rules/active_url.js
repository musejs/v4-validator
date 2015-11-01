"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('active_url', function() {

    it('should pass when the field under validation is a valid URL', function (done) {

        var data = {
            field_1: 'http://google.com'
        };
        var rules = {
            field_1: 'active_url'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation is not a valid URL', function (done) {

        var data = {
            field_1: 'http://google.com',
            field_2: 'http://musejs.io/fake-page',
            field_3: 'ksdjflk'
        };
        var rules = {
            field_1: 'active_url',
            field_2: 'active_url',
            field_3: 'active_url'
        };

        var validator = new V4Validator(data, rules);

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
