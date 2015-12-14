'use strict';

var _ = require('lodash'),
    utils = require('./utils');

function processBasic(swagger, opts, data) {
    var authorizedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'COPY', 'HEAD', 'OPTIONS', 'LINK', 'UNLIK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND'];

    if (data === undefined) { // this is the first processor in the chain
        data = {
            description: swagger.info.description,
            isSecure: swagger.securityDefinitions !== undefined,
            moduleName: opts.moduleName,
            className: opts.className,
            domain: (swagger.schemes && swagger.schemes.length > 0 && swagger.host && swagger.basePath) ? swagger.schemes[0] + '://' + swagger.host + swagger.basePath : '',
            methods: [],
            definitions: []
        };
    }
    _.forEach(swagger.paths, function(api, path){
        var globalParams = [];
        /**
         * @param {Object} op - meta data for the request
         * @param {string} m - HTTP method name - eg: 'get', 'post', 'put', 'delete'
         */

         // Find the global params for this path.
        _.forEach(api, function(op, m){
            if(m.toLowerCase() === 'parameters') {
                globalParams = op;
            }
        });
        _.forEach(api, function(op, m){
            if(authorizedMethods.indexOf(m.toUpperCase()) === -1) {
                return;
            }
            var method = {
                path: path,
                className: opts.className,
                methodName: op['x-swagger-js-method-name'] ? op['x-swagger-js-method-name'] : (op.operationId ? op.operationId : utils.getPathToMethodName(m, path)),
                method: m.toUpperCase(),
                isGET: m.toUpperCase() === 'GET',
                hasPathParameter: false,
                summary: op.description,
                isSecure: op.security !== undefined,
                parameters: [],
                responses: []
            };
            var params = [];
            if(_.isArray(op.parameters)) {
                params = op.parameters;
            }
            params = params.concat(globalParams);
            _.forEach(params,function(parameter) {
                // Ignore headers which are injected by proxies & app servers
                // eg: https://cloud.google.com/appengine/docs/go/requests#Go_Request_headers
                if (parameter['x-proxy-header'] && !data.isNode) {
                    return;
                }
                if (_.isString(parameter.$ref)) {
                    var segments = parameter.$ref.split('/');
                    parameter = swagger.parameters[segments.length === 1 ? segments[0] : segments[2] ];
                }
                parameter.camelCaseName = utils.camelCase(parameter.name);
                if(parameter.enum && parameter.enum.length === 1) {
                    parameter.isSingleton = true;
                    parameter.singleton = parameter.enum[0];
                }
                if(parameter.in === 'body'){
                    parameter.isBodyParameter = true;
                } else if(parameter.in === 'path'){
                    parameter.isPathParameter = true;
                    method.hasPathParameter = true;
                } else if(parameter.in === 'query'){
                    if(parameter.pattern){
                        parameter.isPatternType = true;
                    }
                    parameter.isQueryParameter = true;
                } else if(parameter.in === 'header'){
                    parameter.isHeaderParameter = true;
                } else if(parameter.in === 'formData'){
                    parameter.isFormParameter = true;
                }

                // extract parameter type
                parameter = _.merge(parameter, utils.convertType(parameter));

                method.parameters.push(parameter);
            });

            // extract response type for 200 response, if present
            if (_.isObject(op.responses) && _.isObject(op.responses['200'])) {
                var resp = op.responses['200'];
                if (resp.schema) {
                    method.responseType = utils.convertType(resp);
                } else {
                    method.responseType = '{}'; // This is a hardcoded typescript dependency. todo: refactor
                }
            }

            data.methods.push(method);
        });
    });
    return data;
}

function processDefinitions(swagger, opts, data) {
        // read definitions and their types
    data = _.merge((data || {}), {definitions: []});

    _.forEach(swagger.definitions, function(swaggerType, name) {
        if (swaggerType.type === undefined) {
            // sometimes the 'type' property seems to be missing. In this case, we assume 'object'
            swaggerType.type = 'object';
        }

        var tsType = utils.convertType(swaggerType);
        tsType.name = name;
        data.definitions.push(tsType);
    });

    return data;
}

exports = module.exports = {
    processBasic: processBasic,
    processDefinitions: processDefinitions,
    allProcessors: [processBasic, processDefinitions]
};
