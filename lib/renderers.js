/**
 * A library of render functions.
 **/
'use strict';
var hb = require('handlebars'),
    fs = require('fs'),
    _ = require('lodash'),
    renderers = {};

// Render a curly brace helper because handlebars does not support alternate delimeters
hb.registerHelper('curlify', function(text) {
    return '{' + text + '}';
});

// Helper to check 2 argument equality. #if only supports boolean input
hb.registerHelper('if_eq', function(a, b, opts) {
    if (a === b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

hb.registerHelper('formatParamType', function(param) {
    if (param.isRef) {
        return param.target;
    } else if (param.isArray) {
        // Needs testing
        if (param.elementType.isRef) {
            return param.elementType.target + '[]';
        } else {
            return param.elementType.tsType + '[]';
        }
    } else {
        return param.tsType;
    }
});

hb.registerHelper('formatPropertyType', function(property) {
    if (property.isArray) {
        if (property.elementType.isRef) {
            return property.elementType.target + '[]';
        } else {
            return property.elementType.tsType + '[]';
        }
    } else if (property.isRef) {
        return property.target;
    } else {
        return property.tsType;
    }
});

// Render complex responseTypes
hb.registerHelper('formatResponse', function(resp) {
    // What to do if there is an undefined put in here?
    if (resp === undefined) {
        return '{}';
    }
    if (resp.isArray) {
        if (resp.elementType.isRef) {
            return 'Array<' + resp.elementType.target + '>';
        } else {
            return 'Array<' + resp.elementType.tsType + '>';
        }
    } else if (resp.isRef) {
        return resp.target;
    } else {
        return '{}'; // Unknown response
    }

});

// Basic utility for manipulating odd formatted input
hb.registerHelper('lowercase', function(st) {
    return st.toLowerCase();
});

// Express needs modified a variant on path
hb.registerHelper('expressPath', function(path) {
    var newPath = path.replace(/\{/g, ':').replace(/\}/g, '');

    return newPath;
})

//
function renderFileApi(templateFn, ext, data) {
    var files = {},
        defaultFilename = data.moduleName + ext;

    files[defaultFilename] = templateFn(data);
    return files;
}

/**
 * Default render plugins
 */
function renderAngular() {
    var classTemplate = fs.readFileSync(__dirname + '/../templates/angular-class.mustache', 'UTF-8'),
        methodTemplate = fs.readFileSync(__dirname + '/../templates/method.mustache', 'UTF-8'),
        requestTemplate = fs.readFileSync(__dirname + '/../templates/angular-request.mustache', 'UTF-8'),
        template;

    // Setup handlebars
    hb.registerPartial('method', methodTemplate);
    hb.registerPartial('request', requestTemplate);
    template = hb.compile(classTemplate);

    // Renderers should return a function that can be called to render the data.
    return _.partial(renderFileApi, template, '.js');
}

function renderNode() {
    var classTemplate = fs.readFileSync(__dirname + '/../templates/node-class.mustache', 'UTF-8'),
        methodTemplate = fs.readFileSync(__dirname + '/../templates/method.mustache', 'UTF-8'),
        requestTemplate = fs.readFileSync(__dirname + '/../templates/node-request.mustache', 'UTF-8'),
        template;

    hb.registerPartial('method', methodTemplate);
    hb.registerPartial('request', requestTemplate);
    template = hb.compile(classTemplate);

    return _.partial(renderFileApi, template, '.js');
}

function renderAngularTs() {
    var classTemplate = fs.readFileSync(__dirname + '/../templates/angularTs-class.hb', 'UTF-8'),
        methodTemplate = fs.readFileSync(__dirname + '/../templates/methodTs.hb', 'UTF-8'),
        definitionTemplate = fs.readFileSync(__dirname + '/../templates/definitionsTs.hb', 'UTF-8'),
        dtsTemplate = fs.readFileSync(__dirname + '/../templates/apidts.hb', 'UTF-8'),
        template, defTemplate, dts;

    hb.registerPartial('methodTs', methodTemplate);
    template = hb.compile(classTemplate);
    defTemplate = hb.compile(definitionTemplate);
    dts = hb.compile(dtsTemplate);

    return function(data) {
        var templateFn = _.partial(renderFileApi, template, '.ts'),
            files = templateFn(data);
        _.each(data.definitions, function(def) {
            var modifiedDef = _.merge(def, {moduleName: data.moduleName});
            files[def.name + '.ts'] = defTemplate(modifiedDef);
        });

        files['api.d.ts'] = dts({files: _.keys(files)});
        return files;
    };
}

function renderExpress() {
    var routerTemplate = fs.readFileSync(__dirname + '/../templates/express-router.hb', 'UTF-8'),
        expressMethodTemplate = fs.readFileSync(__dirname + '/../templates/express-method.hb', 'UTF-8'),
        routerHb;

    hb.registerPartial('expressMethod', expressMethodTemplate);
    routerHb = hb.compile(routerTemplate);
    return _.partial(renderFileApi, routerHb, '.js');
}

renderers.angularJs = renderAngular;
renderers.nodeJs = renderNode;
renderers.angularTs = renderAngularTs;
renderers.expressJs = renderExpress;

exports = module.exports = {
    register: function(name, renderFn) {
        renderers[name] = renderFn;
    },
    get: function(name) {
        if (!renderers.hasOwnProperty(name)) {
            throw new Error('Error: plugin (' + name + ') not found');
        }
        return renderers[name]();
    },
    list: function() {
        return _.keys(renderers);
    }
};