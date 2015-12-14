/**
 * A library of render functions.
 **/
'use strict';
var hb = require('handlebars'),
    fs = require('fs'),
    renderers = {};

// Render a helper because handlebars does not support alternate delimeters
hb.registerHelper('curlify', function(text) {
    return '{' + text + '}';
});

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
    return template;
}

function renderNode() {
    var classTemplate = fs.readFileSync(__dirname + '/../templates/node-class.mustache', 'UTF-8'),
        methodTemplate = fs.readFileSync(__dirname + '/../templates/method.mustache', 'UTF-8'),
        requestTemplate = fs.readFileSync(__dirname + '/../templates/node-request.mustache', 'UTF-8'),
        template;

    hb.registerPartial('method', methodTemplate);
    hb.registerPartial('request', requestTemplate);
    template = hb.compile(classTemplate);

    return template;
}

function renderAngularTs() {
    var classTemplate = fs.readFileSync(__dirname + '/../templates/angularTs-class.hb', 'UTF-8'),
        methodTemplate = fs.readFileSync(__dirname + '/../templates/methodTs.hb', 'UTF-8'),
        template;

    hb.registerPartial('methodTs', methodTemplate);
    template = hb.compile(classTemplate);

    return template;
}

renderers.angularJs = renderAngular;
renderers.nodeJs = renderNode;
renderers.angularTs = renderAngularTs;

exports = module.exports = {
    register: function(name, renderFn) {
        renderers[name] = renderFn;
    },
    get: function(name) {
        return renderers[name]();
    }
};