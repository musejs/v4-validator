"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('json', function() {

    it('should pass when the field under validation is a valid JSON string', function (done) {

        var data = {
            field_1: JSON.stringify('hello'),
            field_2: JSON.stringify({greeting: 'hello'}),
            field_3: JSON.stringify(true),
            field_4: JSON.stringify(false),
            field_5: JSON.stringify([1, 2, 3]),
            field_6: JSON.stringify(1),
            field_7: JSON.stringify(0),
            field_8: JSON.stringify('')
        };
        var rules = {
            field_1: 'json',
            field_2: 'json',
            field_3: 'json',
            field_4: 'json',
            field_5: 'json',
            field_6: 'json',
            field_7: 'json',
            field_8: 'json'

        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation is not a valid JSON string', function (done) {

        var data = {
            field_1: 'hello',
            field_2: {greeting: 'hello'},
            //field_3: true,
            //field_4: false,
            field_5: [1, 2, 3],
            //field_6: 1,
            //field_7: 0,
            field_8: '',
            field_9: JSON.stringify({greeting: 'hi'}) + '1'
        };
        var rules = {
            field_1: 'json',
            field_2: 'json',
            field_3: 'json',
            field_4: 'json',
            field_5: 'json',
            //field_6: 'json',
            //field_7: 'json',
            field_8: 'json',
            field_9: 'json'

        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.have.property('meta');
            err.meta.should.have.property('field_1');
            err.meta.should.have.property('field_2');
            //err.meta.should.have.property('field_3');
            //err.meta.should.have.property('field_4');
            err.meta.should.have.property('field_5');
            //err.meta.should.have.property('field_6');
            //err.meta.should.have.property('field_7');
            err.meta.should.have.property('field_8');
            err.meta.should.have.property('field_9');

            done();
        });

    });
});

