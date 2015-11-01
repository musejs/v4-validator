"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('required', function() {

    it('should pass when the field under validation is present in the input data and not empty. Empty: the value is not null, undefined, or has a length of 0', function (done) {

        var data = {
            field_1: 1,
            field_2: 0,
            field_3: true,
            field_4: false,
            field_5: ['hello'],
            field_6: [false],
            field_7: [0],
            field_8: 'i'
        };
        var rules = {
            field_1: 'required',
            field_2: 'required',
            field_3: 'required',
            field_4: 'required',
            field_5: 'required',
            field_6: 'required',
            field_7: 'required',
            field_8: 'required'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation is not present in the input data and not empty. Empty: the value is not null, undefined, or has a length of 0', function (done) {

        var data = {
            field_1: null,
            field_2: undefined,
            field_3: [],
            field_4: ''
        };
        var rules = {
            field_1: 'required',
            field_2: 'required',
            field_3: 'required',
            field_4: 'required',
            field_5: 'required'
        };

        var validator = V4Validator.make(data, rules);

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

