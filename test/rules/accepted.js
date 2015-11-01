"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('accepted', function() {

    it('should pass when the field under validation is yes, on, 1, or true', function (done) {

        var data = {
            field_1: 'yes',
            field_2: 'on',
            field_3: '1',
            field_4: 1,
            field_5: 'true',
            field_6: true
        };
        var rules = {
            field_1: 'accepted',
            field_2: 'accepted',
            field_3: 'accepted',
            field_4: 'accepted',
            field_5: 'accepted',
            field_6: 'accepted'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });

    });
    it('should not pass if the field under validation is not yes, on, 1, or true', function (done) {

        var data = {
            field_1: 'yes',
            field_2: 'on',
            field_3: '1',
            field_4: 1,
            field_5: 'true',
            field_6: true,
            field_7: 'slkdjf'
        };
        var rules = {
            field_1: 'accepted',
            field_2: 'accepted',
            field_3: 'accepted',
            field_4: 'accepted',
            field_5: 'accepted',
            field_6: 'accepted',
            field_7: 'accepted'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.have.property('meta');
            err.meta.should.have.property('field_7');
            err.meta.should.not.have.property('field_6');
            done();
        });

    });
});
