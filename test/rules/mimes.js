"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();
var fixtures_dir = __dirname+'/../fixtures/';

describe('mimes', function() {

    it('should not pass if parameters are not specified', function (done) {

        var data = {
            field_1: fixtures_dir+'sample-bmp.bmp'
        };
        var rules = {
            field_1: 'mimes'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.be.instanceOf(Error);
            done();
        });

    });


    it('should pass when the field under validation has a MIME type corresponding to one of the listed extensions', function (done) {

        var data = {
            field_1: fixtures_dir+'sample-bmp.bmp',
            field_2: fixtures_dir+'sample-gif.gif',
            field_3: fixtures_dir+'sample-jpg.jpg',
            field_4: fixtures_dir+'sample-png.png',
            field_5: 'http://www.bestmotherofthegroomspeeches.com/wp-content/themes/thesis/rotator/sample-1.jpg',
            field_6: fixtures_dir+'sample-png-2.PNG',
            field_7: fixtures_dir+'sample-txt.txt',
            field_8: fixtures_dir+'sample-html.html'

        };
        var rules = {
            field_1: 'mimes:bmp,gif,jpg,png',
            field_2: 'mimes:bmp,gif,jpg,png',
            field_3: 'mimes:bmp,gif,jpg,png',
            field_4: 'mimes:bmp,gif,jpg,png',
            field_5: 'mimes:bmp,gif,jpg,png',
            field_6: 'mimes:bmp,gif,jpg,png',
            field_7: 'mimes:txt',
            field_8: 'mimes:html'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation does not have a MIME type corresponding to one of the listed extensions', function (done) {

        var data = {
            field_1: fixtures_dir+'sample-bmp.bmp',
            field_2: fixtures_dir+'sample-gif.gif',
            field_3: fixtures_dir+'sample-jpg.jpg',
            field_4: fixtures_dir+'sample-png.png',
            field_5: 'http://www.bestmotherofthegroomspeeches.com/wp-content/themes/thesis/rotator/sample-1.jpg',
            field_6: fixtures_dir+'sample-png-2.PNG',
            field_7: fixtures_dir+'sample-txt.txt',
            field_8: fixtures_dir+'sample-html.html'

        };
        var rules = {
            field_1: 'mimes:gif,jpg,png',
            field_2: 'mimes:bmp,jpg,png',
            field_3: 'mimes:bmp,gif,png',
            field_4: 'mimes:bmp,gif,jpg',
            field_5: 'mimes:bmp,gif,png',
            field_6: 'mimes:bmp,gif,jpg',
            field_7: 'mimes:html',
            field_8: 'mimes:txt'
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
            err.meta.should.have.property('field_6');
            err.meta.should.have.property('field_7');
            err.meta.should.have.property('field_8');

            done();
        });

    });
});


