"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('alpha_num', function() {

    it('should pass when the field under validation is entirely alpha-numeric characters', function (done) {

        var data = {
            field_1: 'ksdjf123',
            field_2: 'kslfj',
            field_3: '123',
            field_4: 123
        };
        var rules = {
            field_1: 'alpha_num',
            field_2: 'alpha_num',
            field_3: 'alpha_num',
            field_4: 'alpha_num'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });

    });
    it('should not pass if the field under validation is not entirely alpha-numeric characters', function (done) {

        var data = {
            field_1: 'ksdjf123',
            field_2: 'kslfj',
            field_3: '123',
            field_4: 123,
            field_5: 'ksdf-skdjf'
        };
        var rules = {
            field_1: 'alpha_num',
            field_2: 'alpha_num',
            field_3: 'alpha_num',
            field_4: 'alpha_num',
            field_5: 'alpha_num'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.have.property('meta');
            err.meta.should.not.have.property('field_1');
            err.meta.should.not.have.property('field_2');
            err.meta.should.not.have.property('field_3');
            err.meta.should.not.have.property('field_4');
            err.meta.should.have.property('field_5');
            done();
        });

    });
});



