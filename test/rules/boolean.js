"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('boolean', function() {

    it('should pass when the field under validation is able to be cast as a boolean. Accepted input are true, false, 1, 0, "1", and "0"', function (done) {

        var data = {
            field_1: true,
            field_2: false,
            field_3: 1,
            field_4: 0,
            field_5: '1',
            field_6: '0',
            field_7: 'true',
            field_8: 'false'
        };
        var rules = {
            field_1: 'boolean',
            field_2: 'boolean',
            field_3: 'boolean',
            field_4: 'boolean',
            field_5: 'boolean',
            field_6: 'boolean',
            field_7: 'boolean',
            field_8: 'boolean'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation is not able to be cast as a boolean. Accepted input are true, false, 1, 0, "1", and "0"', function (done) {

        var data = {
            field_1: true,
            field_2: false,
            field_3: 1,
            field_4: 0,
            field_5: '1',
            field_6: '0',
            field_7: 'true',
            field_8: 'false',
            field_9: 298347,
            field_10: 'skdfj',
            field_11: null,
            field_12: undefined
        };
        var rules = {
            field_1: 'boolean',
            field_2: 'boolean',
            field_3: 'boolean',
            field_4: 'boolean',
            field_5: 'boolean',
            field_6: 'boolean',
            field_7: 'boolean',
            field_8: 'boolean',
            field_9: 'boolean',
            field_10: 'boolean',
            field_11: 'boolean',
            field_12: 'boolean'

        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.have.property('meta');
            err.meta.should.not.have.property('field_1');
            err.meta.should.not.have.property('field_2');
            err.meta.should.not.have.property('field_3');
            err.meta.should.not.have.property('field_4');
            err.meta.should.not.have.property('field_5');
            err.meta.should.not.have.property('field_6');
            err.meta.should.not.have.property('field_7');
            err.meta.should.not.have.property('field_8');
            err.meta.should.have.property('field_9');
            err.meta.should.have.property('field_10');
            err.meta.should.have.property('field_11');
            err.meta.should.have.property('field_12');

            done();
        });

    });
});
