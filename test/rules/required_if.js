"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('required_if', function() {

    it('should not pass without the anotherfield argument', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 'hi',
            field_3: 'hola',
            field_4: null
        };
        var rules = {
            field_1: 'required_if',
            field_3: 'required_if'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            done();
        });
    });

    it('should not pass without the value arguments', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 'hi',
            field_3: 'hola',
            field_4: null
        };
        var rules = {
            field_1: 'required_if:field_2',
            field_3: 'required_if:field_4'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            done();
        });
    });

    it('should pass when the field under validation is present and the anotherfield field is equal to any value', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 'hi',
            field_3: 'hola',
            field_4: null,
            field_5: 'hey',
            field_6: 'howdy',
            field_7: 'yo',
            field_8: false,
            field_9: 'bro',
            field_10: 0
        };
        var rules = {
            field_1: 'required_if:field_2,hi',
            field_3: 'required_if:field_4,null',
            field_5: 'required_if:field_6,sup,howdy',
            field_7: 'required_if:field_8,false',
            field_9: 'required_if:field_10,0'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation is not present and the anotherfield field is equal to any value', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 'hi',
            field_3: 'hola',
            field_4: null
        };
        var rules = {
            field_1: 'required_if:field_2,hola',
            field_3: 'required_if:field_4,hey',
            field_5: 'required_if:field_3,hola'
        };

        var validator = V4Validator.make(data, rules);

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


