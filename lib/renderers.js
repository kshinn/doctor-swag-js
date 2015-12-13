/**
 * A library of handlebars helpers for template functions
 **/
'use strict';
var hb = require('handlebars'),
    fs = require('fs');

hb.registerHelper('curlify', function(text) {
    return '{' + text + '}';
});

hb.compile('{{foo}}');

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

exports = module.exports = {
    angularJs: renderAngular,
    nodeJs: renderNode
};