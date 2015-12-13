'use strict';

var assert = require('chai').assert,
    fs = require('fs'),
    processors = require('../lib/processors');

describe('data processors', function() {
    var echoApi = fs.readFileSync(__dirname + '/apis/echo.json'),
        opts = {'moduleName': 'Test', 'className': 'Test'};

    echoApi = JSON.parse(echoApi);

    it('should process basic data', function() {
        var result = processors.processBasic(echoApi, opts);

        assert.property(result, 'methods');
        assert.isArray(result.methods, 'Methods should be an array of method objects');
        assert.lengthOf(result.methods, 3, 'Methods should contain something');
        assert.property(result, 'definitions');
        assert.isArray(result.definitions);
        assert.lengthOf(result.definitions, 0, 'No definitions should have processed');
    });

    it('should process definitions', function() {
        var petstoreApi = fs.readFileSync(__dirname + '/apis/petstore.json'),
            result;

        petstoreApi = JSON.parse(petstoreApi);
        result = processors.processDefinitions(petstoreApi, opts);

        assert.property(result, 'definitions');
        assert.isArray(result.definitions);
        assert.lengthOf(result.definitions, 5);

    });

});