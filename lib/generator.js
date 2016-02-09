'use strict';

var swt = require('swagger-tools').specs.v2,
    _ = require('lodash'),
    source = '',
    processors = require('./processors').allProcessors,
    renderers = require('./renderers'),
    q = require('q');

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
    var defer = q.defer();
    // Validate Swagger
    swt.validate(swaggerObj, function(err, result) {
        if (err) {
            throw err;
        }

        if (typeof result !== 'undefined') {
            // Process swagger doc into render vars
            if (result.errors && result.errors.length > 0) {
                defer.reject(result.errors);
            }
        } else {
            var data = processSwagger(swaggerObj, opts);

            // render template
            var render = renderers.get(opts.type);
            source = render(data);
            defer.resolve(source);
        }
    });

    return defer.promise;
}

exports = module.exports = {
    generate: generate,
    addRenderPlugin: renderers.register,
    listRenderPlugins: renderers.list
};