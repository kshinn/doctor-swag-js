var renderer = require('../lib/renderers'),
    assert = require('chai').assert,
    rewire = require('rewire'),
    generator = rewire('../lib/generator.js'),
    fs = require('fs'),
    _ = require('lodash'),
    yaml = require('yaml-js');

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

        renderFn = renderer.get('angularTs');
        result = renderFn(data);
        assert.isObject(result);

        // Ensure each definition is rendered as a file
        _.forEach(data.definitions, function(def) {
            var fileName = def.name + '.ts';
            assert(result.hasOwnProperty(fileName), 'results should have key ' + fileName);
            assert.isString(result[fileName]);
        });
    });

    it('should render our swagger', function() {
        var ourApi = fs.readFileSync(__dirname + '/apis/swagger.yaml', 'UTF-8');
        ourApi = yaml.load(ourApi);

        data = process(ourApi, {
            moduleName: 'Keypr',
            className: 'KeyprApi',
            type: 'angularTs'
        });
        //console.log(data);

        renderFn = renderer.get('angularTs');
        result = renderFn(data);
        // _.each(data.definitions, function(item) {
        //     console.log(item);
        // });
        //console.log(result['Keypr.ts']);
    });

    it('should render $ref properties', function() {
        var testRef = fs.readFileSync(__dirname + '/apis/testref.yaml', 'UTF-8');
        testRef = yaml.load(testRef);

        data = process(testRef, {
            moduleName: 'MyModule',
            className: 'MyClass',
            type: 'angularTs'
        });

        renderFn = renderer.get('angularTs');
        result = renderFn(data);
        var expectedDefinition = "bar_prop: Bar";
        assert(
            result['foo.ts'].indexOf(expectedDefinition) > -1,
            "Variable definition is not generated as expect"
        );
    });
})
