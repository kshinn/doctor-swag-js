var renderer = require('../lib/renderers'),
    assert = require('chai').assert,
    rewire = require('rewire'),
    generator = rewire('../lib/generator.js'),
    fs = require('fs'),
    _ = require('lodash');

describe('Default Renderers', function() {
    var echoApi = fs.readFileSync(__dirname + '/apis/echo.json'),
        process = generator.__get__('processSwagger');

        echoApi = JSON.parse(echoApi);

    it('should produce javascript', function() {
        var data, result, renderFn;

        data = process(echoApi, {
            moduleName: 'TestModule',
            className: 'TestClass',
            type: 'angularJs'
        });

        renderFn = renderer.get('angularJs');
        result = renderFn(data);
        assert.isObject(result);
        assert.isString(result[data.moduleName + '.js']);

    });

    it('should produce node js', function() {
        var data, result, renderFn;
        data = process(echoApi, {
            moduleName: 'NodeModule',
            className: 'NodeClass',
            type: 'node'
        });

        renderFn = renderer.get('nodeJs');
        result = renderFn(data);
        assert.isObject(result);
        assert.isString(result[data.moduleName + '.js']);
    });

    it('should produce Angular TypeScript', function() {
        var data, result, renderFn;
        data = process(echoApi, {
            moduleName: 'TsModule',
            className: 'TsApi',
            type: 'angularTs'
        });

        renderFn = renderer.get('angularTs');
        result = renderFn(data);
        assert.isObject(result);
    });

    it('should produce Typescript definitions', function() {
        var uberApi = fs.readFileSync(__dirname + '/apis/uber.json');
        uberApi = JSON.parse(uberApi);

        data = process(uberApi, {
            moduleName: 'UberModule',
            className: 'UberApi',
            type: 'angularTs'
        });

        _.each(data.definitions, function(item) {
         console.log(item.properties);
        });

        renderFn = renderer.get('angularTs');
        result = renderFn(data);
        assert.isObject(result);

        // Ensure each definition is rendered as a file
        _.forEach(data.definitions, function(def) {
            var fileName = def.name + '.ts';
            console.log(result[fileName]);
            assert(result.hasOwnProperty(fileName), 'results should have key ' + fileName);
            assert.isString(result[fileName]);
        });
    });
})
