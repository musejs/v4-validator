"use strict";
var should = require('should');
var moment = require('moment-timezone');
var V4Validator = require('../../src/factory')();

describe('before', function() {


    it('should not pass if a date parameter is not specified', function (done) {

        var now = moment();
        var data = {
            field_1: now.clone().subtract(1, 'days').toISOString()
        };
        var rules = {
            field_1: 'before'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.be.instanceOf(Error);
            done();
        });


    });


    it('should pass when the field under validation is a value before a given date. The dates will be passed into moment.js', function (done) {

        var now = moment();

        var data = {
            field_1: now.clone().subtract(1, 'days').toISOString()
        };
        var rules = {
            field_1: 'before:'+now.toISOString()
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });


    });

    it('should not pass if the field under validation is not a value before a given date. The dates will be passed into moment.js', function (done) {

        var now = moment();

        var data = {
            field_1: now.clone().subtract(1, 'days').toISOString(),
            field_2: now.clone().add(1, 'days').toISOString()
        };
        var rules = {
            field_1: 'before:'+now.toISOString(),
            field_2: 'before:'+now.toISOString()
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.have.property('meta');
            err.meta.should.have.property('field_2');
            err.meta.should.not.have.property('field_1');
            done();
        });


    });
});


