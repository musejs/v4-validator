"use strict";
var should = require('should');
var moment = require('moment-timezone');
var V4Validator = require('../../src/factory')();

describe('date_format', function() {

    it('should not pass if a format parameter is not specified', function (done) {

        var now = moment();
        var data = {
            field_1: '10-31-2015'
        };
        var rules = {
            field_1: 'date_format'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.be.instanceOf(Error);
            done();
        });

    });

    it('should pass when the field under validation matches the given format. The format will be evaluated using moment.js. You should use either date or date_format when validating a field, not both', function (done) {

        var now = moment();

        var data = {
            field_1: '10-31-2015',
            field_2: '10-31-15',
            field_3: '01-01-2015',
            field_4: '1-1-2015',
            field_5: 'Jan 1 2015',
            field_6: 'Jan 1st 2015',
            field_7: 'January 1st, 2015',
            field_8: now.unix(),
            field_9: 'Mon',
            field_10: 'Monday',
            field_11: '3:45pm',
            field_12: '15:45',
            field_13: '5:45'
        };
        var rules = {
            field_1: 'date_format:MM-DD-YYYY',
            field_2: 'date_format:MM-DD-YY',
            field_3: 'date_format:MM-DD-YYYY',
            field_4: 'date_format:M-D-YYYY',
            field_5: 'date_format:MMM D YYYY',
            field_6: 'date_format:MMM Do YYYY',
            field_7: 'date_format:MMMM Do, YYYY',
            field_8: 'date_format:X',
            field_9: 'date_format:ddd',
            field_10: 'date_format:dddd',
            field_11: 'date_format:h:mma',
            field_12: 'date_format:HH:mm',
            field_13: 'date_format:H:mm'

        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });


    });

    it('should not pass if the field under validation does not match the given format. The format will be evaluated using moment.js. You should use either date or date_format when validating a field, not both', function (done) {

        var now = moment();

        var data = {
            field_1: '10-31-2015',
            field_2: '10-31-15',
            field_3: '01-01-lksdjf',
            field_4: '1-1-2015',
            field_5: 'GAR 1 2015',
            field_6: 'Jan 15 2015',
            field_7: 'Garbage 1st 2015',
            field_8: now.unix()+'skldjf',
            field_9: 'Gar',
            field_10: 'Garbage',
            field_11: '3:45askd',
            field_12: '24:45',
            field_13: '5:45'
        };
        var rules = {
            field_1: 'date_format:D',
            field_2: 'date_format:sdflkjl',
            field_3: 'date_format:MM-DD-YYYY',
            field_4: 'date_format:MM-DD-YYYY',
            field_5: 'date_format:MMM D YYYY',
            field_6: 'date_format:MMM Do YYYY',
            field_7: 'date_format:MMMM Do YYYY',
            field_8: 'date_format:Y',
            field_9: 'date_format:ddd',
            field_10: 'date_format:dddd',
            field_11: 'date_format:h:mma',
            field_12: 'date_format:HH:mm',
            field_13: 'date_format:Y'

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
            err.meta.should.have.property('field_6');
            err.meta.should.have.property('field_7');
            err.meta.should.have.property('field_8');
            err.meta.should.have.property('field_9');
            err.meta.should.have.property('field_10');
            err.meta.should.have.property('field_11');
            err.meta.should.have.property('field_12');
            err.meta.should.have.property('field_13');

            done();
        });

    });
});



