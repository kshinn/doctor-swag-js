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

        renderFn = renderer.angularJs();
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

        renderFn = renderer.nodeJs();
        result = renderFn(data);
        assert.isString(result);
        console.log(result);
    })
})
