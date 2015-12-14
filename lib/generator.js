'use strict';

var swt = require('swagger-tools').specs.v2,
    _ = require('lodash'),
    plugins = {},
    source = '',
    processors = require('./processors').allProcessors;

function processSwagger(swaggerObj, opts) {
    var procList;

    // Run processes
    procList = _.map(processors, function(fn) {
        return _.partial(fn, swaggerObj, opts);
    });

    // allow the processors array to be spread over arguments in the function
    var flowSpread = _.spread(_.flow);
    var data = flowSpread(procList)();
    return data;
}

function generate(swaggerObj, opts) {

    // Validate Swagger
    swt.validate(swaggerObj, function(err, result) {
        if (err) {
            throw err;
        }

        if (typeof result !== undefined) {
            // Process swagger doc into render vars
            var data = processSwagger(swaggerObj, opts);

            // render template
            if (plugins.hasOwnProperty(opts.type)) {
                source = plugins[opts.type](data);
                return source;
            } else {
                throw new Error('Plugin ' + opts.type + ' not found');
            }
        } else {
            console.log(result);
        }
    });
}

function addRenderPlugin(name, fn) {
    if (plugins.hasOwnProperty(name)) {
        throw new Error('A plugin with name: ' + name + ' has already been registered');
    } else {
        plugins[name] = fn;
    }
}

function listRenderPlugins() {
    return _.keys(plugins);
}

exports = module.exports = {
    generate: generate,
    addRenderPlugin: addRenderPlugin,
    listRenderPlugins: listRenderPlugins
};