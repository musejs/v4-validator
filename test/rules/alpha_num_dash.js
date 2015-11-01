"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('alpha_num_dash', function() {

    it('should pass when the field under validation is alpha-numeric characters, as well as dashes and underscores', function (done) {

        var data = {
            field_1: 'k-l_s--d__jflk-',
            field_2: 'kslfj',
            field_3: 'sksjf-slkdjf-',
            field_4: 'ksljdf_ksdjf_',
            field_5: '_-_'
        };
        var rules = {
            field_1: 'alpha_num_dash',
            field_2: 'alpha_num_dash',
            field_3: 'alpha_num_dash',
            field_4: 'alpha_num_dash',
            field_5: 'alpha_num_dash'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });

    });
    it('should not pass if the field under validation is not alpha-numeric characters, or dashes and underscores', function (done) {

        var data = {
            field_1: 'k-l_s--d__jflk-',
            field_2: 'kslfj',
            field_3: 'sksjf-slkdjf-',
            field_4: 'ksljdf_ksdjf_',
            field_5: '_-_',
            field_6: '456',
            field_7: 456
        };
        var rules = {
            field_1: 'alpha_num_dash',
            field_2: 'alpha_num_dash',
            field_3: 'alpha_num_dash',
            field_4: 'alpha_num_dash',
            field_5: 'alpha_num_dash',
            field_6: 'alpha_num_dash',
            field_7: 'alpha_num_dash'

        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.have.property('meta');
            err.meta.should.not.have.property('field_1');
            err.meta.should.not.have.property('field_2');
            err.meta.should.not.have.property('field_3');
            err.meta.should.not.have.property('field_4');
            err.meta.should.not.have.property('field_5');
            err.meta.should.not.have.property('field_6');
            err.meta.should.have.property('field_7');
            done();
        });

    });
});


