'use strict';

var generator = require('../lib/generator'),
    assert = require('chai').assert,
    fs = require('fs'),
    rewire = require('rewire'),
    regen = rewire('../lib/generator.js');

describe('generator', function() {
    var executed = false;

    it('should add render plugins', function() {
        var plugins;

        generator.addRenderPlugin('test-plugin', function(s) {
            executed = true;
        });

        plugins = generator.listRenderPlugins();
        assert(plugins.length > 0);
        assert(plugins[0], 'test-plugin');
    });

    it('should execute based on plugin name', function() {
        var swagger = fs.readFileSync(__dirname + '/apis/echo.json', 'UTF-8');
        swagger = JSON.parse(swagger);

        generator.generate(swagger, {'type': 'test-plugin'});
        assert.ok(executed, 'the function should have executed');
    })

    it('should run all processors', function() {
        var swagger = fs.readFileSync(__dirname+ '/apis/uber.json', 'UTF-8'),
            procSw = regen.__get__('processSwagger'),
            data;
        swagger = JSON.parse(swagger);
        data = procSw(swagger, {});

        assert.property(data, 'methods');
        assert.property(data, 'definitions');
        assert.isArray(data.methods);
        assert.lengthOf(data.methods, 5);

        assert.isArray(data.definitions);
        assert.lengthOf(data.definitions, 6);
    })
});