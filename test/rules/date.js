"use strict";
var should = require('should');
var moment = require('moment-timezone');
var V4Validator = require('../../src/factory')();

describe('date', function() {

    it('should pass when the field under validation is a valid date according to moment.js', function (done) {

        var now = moment();

        var data = {
            field_1: now.toISOString(),
            field_2: now.format(),
            field_3: '2015-10-31',
            field_4: 12334
        };
        var rules = {
            field_1: 'date:true',
            field_2: 'date',
            field_3: 'date',
            field_4: 'date'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            data.field_1.toISOString().should.equal(now.toISOString());
            done();
        });


    });

    it('should not pass if the field under validation is not a valid date according to moment.js', function (done) {

        var now = moment();

        var data = {
            field_1: now.toISOString(),
            field_2: now.format(),
            field_3: '2015-10-31',
            field_4: 12334,
            field_5: '2015-10-32',
            field_6: 'tomorrow',
            field_7: 'Monday'
        };
        var rules = {
            field_1: 'date',
            field_2: 'date',
            field_3: 'date',
            field_4: 'date',
            field_5: 'date',
            field_6: 'date',
            field_7: 'date'
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
            err.meta.should.have.property('field_6');
            err.meta.should.have.property('field_7');

            done();
        });


    });
});


