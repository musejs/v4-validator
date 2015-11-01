"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('ip', function() {

    it('should pass when the field under validation is an IP address', function (done) {

        var data = {
            field_1: '123.123.123.123',
            field_2: '192.168.0.1',
            field_3: '10.1.1.1',
            field_4: '172.16.0.1'
        };
        var rules = {
            field_1: 'ip',
            field_2: 'ip',
            field_3: 'ip',
            field_4: 'ip'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation is not an IP address', function (done) {

        var data = {
            field_1: '256.256.256.256',
            field_2: '123.123.123.123.123',
            field_3: '192.168.0',
            field_4: '10.1',
            field_5: '172'
        };
        var rules = {
            field_1: 'ip',
            field_2: 'ip',
            field_3: 'ip',
            field_4: 'ip',
            field_5: 'ip'
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


