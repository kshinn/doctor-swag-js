# Doctor Swag

This is a node module that functions as an extensible code generator for Swagger 2.0. It is based on wcandillon's excellent module https://github.com/wcandillon/swagger-js-codegen. This module represents a fairly large internal structural change while trying to maintain compatibility with the original module (Swagger 1.x support was dropped).

## Additional Features
* Users swagger-tools to validate the in bound swagger document
* Has an extensible Pipeline to add new processing stages (for processing the template data) and renderers (new languages / frameworks).
* Upgrades the mustache rendering lib to handlebars
* Adds Typescript (Angular) support by default

##Installation
```bash
npm install doctor-swag
```

##Example
```javascript
var fs = require('fs');
var CodeGen = require('doctorSwag');

var file = 'swagger/spec.json';
var swagger = JSON.parse(fs.readFileSync(file, 'UTF-8'));
var nodejsSourceCode = CodeGen({ moduleName: 'TestModule', className: 'Test', swagger: swagger, type: 'node' });
var angularTsSourceCode = CodeGen.getAngularCode({ moduleName: 'TestModule', className: 'Test', swagger: swagger, type: 'angularTs' });
console.log(nodejsSourceCode);
console.log(angularjsSourceCode);
```

##Custom template
```javascript
CodeGen.addRenderPlugin('plugin-name', function() {
    var fs = require('fs');
    var codeTemplate = fs.readFileSync('path/to/template.hb', 'UTF-8');
    var anyPartial = fs.readFileSync('path/to/partial', 'UTF-8');

    hb.registerPartial('partialName', anyPartial);
    hb.registerHelper('anyHelperYouNeed', function(text){});
    codeTemplate = hb.compile(codeTemplate);

    // return a function that can be used to render
    return function(data) {
        codeTemplate(data);
    }
})

var source = CodeGen({
    moduleName: 'Test',
    className: 'Test',
    swagger: swaggerSpec,
    type: 'plugin-name'
});
```

##Options
In addition to the common options listed below, `getCustomCode()` *requires* a `template` field:

    template: { class: "...", method: "...", request: "..." }

`getAngularCode()`, `getNodeCode()`, and `getCustomCode()` each support the following options:

```yaml
  moduleName:
    type: string
    description: Your AngularJS module name
  className:
    type: string
  type:
    type: string
    description: name of the plugin to render code. (default support for node, angularJs, angularTs)
  swagger:
    type: object
    required: true
    properties:
      swagger:
        description: |
          For Swagger Specification version 2.0 value of field 'swagger' must be a string '2.0'
        type: string
        enum:
        - 2.0
      info:
        type: object
        properties:
          description:
            type: string
            description: Made available to templates as '{{&description}}'
      securityDefinitions:
        type: object
        description:
      parameters:
        type: array
        items:
          type: object
          properties:
            name:
              type: string
              required: true
            enum:
              type: array
            in:
              type: string
              enum:
              - body
              - path
              - query
              - header
              - formData
```

###Template Variables
The following data are passed to the [mustache templates](https://github.com/janl/mustache.js):

```yaml
isNode:
  type: boolean
description:
  type: string
  description: Provided by your options field: 'swagger.info.description'
isSecure:
  type: boolean
  description: false unless 'swagger.securityDefinitions' is defined
moduleName:
  type: string
  description: Your AngularJS module name - provided by your options field
className:
  type: string
  description: Provided by your options field
domain:
  type: string
  description: If all options defined: swagger.schemes[0] + '://' + swagger.host + swagger.basePath
methods:
  type: array
  items:
    type: object
    properties:
      path:
        type: string
      className:
        type: string
        description: Provided by your options field
      methodName:
        type: string
        description: Generated from the HTTP method and path elements or 'x-swagger-js-method-name' field
      method:
        type: string
        description: 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'COPY', 'HEAD', 'OPTIONS', 'LINK', 'UNLIK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND'
        enum:
        - GET
        - POST
        - PUT
        - DELETE
        - PATCH
        - COPY
        - HEAD
        - OPTIONS
        - LINK
        - UNLIK
        - PURGE
        - LOCK
        - UNLOCK
        - PROPFIND
      isGET:
        type: string
        description: true if method === 'GET'
      summary:
        type: string
        description: Provided by the 'description' field in the schema
      isSecure:
        type: boolean
        description: true if the 'security' is defined for the method in the schema
      parameters:
        type: array
        description: Includes all of the properties defined for the parameter in the schema plus:
        items:
          camelCaseName:
            type: string
          isSingleton:
            type: boolean
            description: true if there was only one 'enum' defined for the parameter
          singleton:
            type: string
            description: the one and only 'enum' defined for the parameter (if there is only one)
          isBodyParameter:
            type: boolean
          isPathParameter:
            type: boolean
          isQueryParameter:
            type: boolean
          isPatternType:
            type: boolean
            description: true if *in* is 'query', and 'pattern' is defined
          isHeaderParameter:
            type: boolean
          isFormParameter:
            type: boolean
```

##Swagger Extensions

### x-swagger-js-method-name
By default, javascript method names are generated by concatenating the HTTP method name and path segments.
Generally, the generated names read well, but sometimes they turn out wrong:

```javascript
// A PUT to this path in a swagger schema:  /records/{id}/meta
// is intended to update a "meta" property on a specific "Record" entity.
// ...swagger-js-codegen generates a method named:
MyApi.prototype.putEntitiesByIdMeta = function(parameters) {
```