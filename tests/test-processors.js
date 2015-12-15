'use strict';

var assert = require('chai').assert,
    fs = require('fs'),
    rewire = require('rewire'),
    processSwagger = rewire('../lib/generator').__get__('processSwagger'),
    processors = require('../lib/processors'),
    _ = require('lodash');

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

    it('should be able to add processors', function() {
        // This is a pipeline so you always need return data in order to not break the pipe
        processors.addProcessor(function(swagger, opts, data) {
            data.testAttribute = true;
            return data;
        });

        assert.lengthOf(processors.allProcessors, 3);
        var result = processSwagger(echoApi, {moduleName: 'test', className: 'test'});
        assert(result.testAttribute);
    });

    it('should not be able to add non functions', function() {
        var caughtErr = false;
        try {
            assert.processors.addProcessor('anything')
        } catch(err) {
            caughtErr = true;
        } finally {
            assert.ok(caughtErr, 'You should not be able to add non functions to processors');
        }
    })
});