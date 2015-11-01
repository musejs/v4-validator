"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('required_with', function() {

    it('should not pass without the other fields', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 'hi',
            field_3: 'hola',
            field_4: null
        };
        var rules = {
            field_1: 'required_with',
            field_3: 'required_with'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            done();
        });
    });

    it('should pass when the field under validation is present only if any of the other specified fields are present', function (done) {

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
            field_1: 'required_with:field_2',
            field_3: 'required_with:field_4,field_5,field_6'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation is not present only if any of the other specified fields are present', function (done) {

        var data = {
            field_1: 'hello',
            field_2: '',
            field_3: 'hola',
            field_4: null,
            field_5: 'howdy',
            field_6: []
        };
        var rules = {
            field_1: 'required_with:field_2',
            field_3: 'required_with:field_4',
            field_5: 'required_with:field_6',
            field_7: 'required_with:field_1'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.have.property('meta');
            err.meta.should.have.property('field_1');
            err.meta.should.have.property('field_3');
            err.meta.should.have.property('field_5');
            err.meta.should.have.property('field_7');
            done();
        });

    });
});



