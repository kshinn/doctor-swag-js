var renderer = require('../lib/renderers'),
    assert = require('chai').assert,
    rewire = require('rewire'),
    generator = rewire('../lib/generator.js'),
    fs = require('fs');

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
        assert.isString(result);

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
        assert.isString(result);
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
        assert.isString(result);
    });
})
