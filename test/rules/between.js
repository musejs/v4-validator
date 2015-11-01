"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('between', function() {

    it('should not pass without the min and max arguments', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 5,
            field_3: ['hello', 'hey', 'hi', 'yo', 'sup']
        };
        var rules = {
            field_1: 'between'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            done();
        });
    });

    it('should not pass without the max argument', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 5,
            field_3: ['hello', 'hey', 'hi', 'yo', 'sup']
        };
        var rules = {
            field_1: 'between:3'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            done();
        });
    });

    it('should pass when the field under validation is a size between the given min and max. Strings, numerics, and files are evaluated in the same fashion as the size rule', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 5,
            field_3: ['hello', 'hey', 'hi', 'yo', 'sup']
        };
        var rules = {
            field_1: 'between:4,6|between:4,5|between:5,6',
            field_2: 'between:4,6|between:4,5|between:5,6',
            field_3: 'between:4,6|between:4,5|between:5,6'

        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation is not a size between the given min and max. Strings, numerics, and files are evaluated in the same fashion as the size rule', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 5,
            field_3: ['hello', 'hey', 'hi', 'yo', 'sup'],
            field_4: 'hello!!',
            field_5: 7,
            field_6: ['hello', 'hey', 'hi', 'yo', 'sup', 'howdy', 'headnod'],
            field_7: 'hel',
            field_8: 3,
            field_9: ['hello', 'hey', 'hi']
        };
        var rules = {
            field_1: 'between:4,6|between:4,5|between:5,6',
            field_2: 'between:4,6|between:4,5|between:5,6',
            field_3: 'between:4,6|between:4,5|between:5,6',
            field_4: 'between:4,6|between:4,5|between:5,6',
            field_5: 'between:4,6|between:4,5|between:5,6',
            field_6: 'between:4,6|between:4,5|between:5,6',
            field_7: 'between:4,6|between:4,5|between:5,6',
            field_8: 'between:4,6|between:4,5|between:5,6',
            field_9: 'between:4,6|between:4,5|between:5,6'

        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.have.property('meta');
            err.meta.should.not.have.property('field_1');
            err.meta.should.not.have.property('field_2');
            err.meta.should.not.have.property('field_3');
            err.meta.should.have.property('field_4');
            err.meta.should.have.property('field_5');
            err.meta.should.have.property('field_6');
            err.meta.should.have.property('field_7');
            err.meta.should.have.property('field_8');
            err.meta.should.have.property('field_9');
            done();
        });

    });
});

