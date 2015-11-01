"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('required_without', function() {

    it('should not pass without the other fields', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 'hi',
            field_3: 'hola',
            field_4: null
        };
        var rules = {
            field_1: 'required_without',
            field_3: 'required_without'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            done();
        });
    });

    it('should pass when the field under validation is present only if any of the other specified fields are not present', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 'hi',
            field_3: 'hola',
            field_4: 'hey',
            field_5: null,
            field_6: 'yo',
            field_7: ''
        };
        var rules = {
            field_1: 'required_without:field_2,field_5',
            field_3: 'required_without:field_4,field_6,field_7'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation is not present only if any of the other specified fields are not present', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 'hey',
            field_3: 'hola',
            field_4: 0,
            field_5: false,
            field_6: ['sup']
        };
        var rules = {
            field_1: 'required_without:field_2',
            field_3: 'required_without:field_4',
            field_5: 'required_without:field_6'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.have.property('meta');
            err.meta.should.have.property('field_1');
            err.meta.should.have.property('field_3');
            err.meta.should.have.property('field_5');
            done();
        });

    });
});
