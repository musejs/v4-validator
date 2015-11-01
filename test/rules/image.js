"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();
var fixtures_dir = __dirname+'/../fixtures/';

describe('image', function() {

    it('should pass when the field under validation is an image (jpeg, png, bmp, gif, or svg)', function (done) {

        var data = {
            field_1: fixtures_dir+'sample-bmp.bmp',
            field_2: fixtures_dir+'sample-gif.gif',
            field_3: fixtures_dir+'sample-jpg.jpg',
            field_4: fixtures_dir+'sample-png.png',
            field_5: 'http://www.bestmotherofthegroomspeeches.com/wp-content/themes/thesis/rotator/sample-1.jpg'

        };
        var rules = {
            field_1: 'image',
            field_2: 'image',
            field_3: 'image',
            field_4: 'image',
            field_5: 'image'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation is not an image (jpeg, png, bmp, gif, or svg)', function (done) {

        var data = {
            field_1: 'hello.lkj',
            field_2: fixtures_dir+'sample-txt.txt'
        };
        var rules = {
            field_1: 'image',
            field_2: 'image'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.have.property('meta');
            err.meta.should.have.property('field_1');
            err.meta.should.have.property('field_2');
            done();
        });

    });
});

