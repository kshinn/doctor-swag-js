'use strict';

var _ = require('lodash');

var camelCase = function(id) {
    if(id.indexOf('-') === -1) {
        return id;
    }
    var tokens = [];
    id.split('-').forEach(function(token, index){
        if(index === 0) {
            tokens.push(token[0].toLowerCase() + token.substring(1));
        } else {
            tokens.push(token[0].toUpperCase() + token.substring(1));
        }
    });
    return tokens.join('');
};

var getPathToMethodName = function(m, path){
    if(path === '/' || path === '') {
        return m;
    }

    // clean url path for requests ending with '/'
    var cleanPath = path;
    if( cleanPath.indexOf('/', cleanPath.length - 1) !== -1 ) {
        cleanPath = cleanPath.substring(0, cleanPath.length - 1);
    }

    var segments = cleanPath.split('/').slice(1);
    segments = _.transform(segments, function (result, segment) {
        if (segment[0] === '{' && segment[segment.length - 1] === '}') {
            segment = 'by' + segment[1].toUpperCase() + segment.substring(2, segment.length - 1);
        }
        result.push(segment);
    });
    var result = camelCase(segments.join('-'));
    return m.toLowerCase() + result[0].toUpperCase() + result.substring(1);
};

/**
 * Author: alexkrauss
 * Recursively converts a swagger type description into a typescript type, i.e., a model for our mustache
 * template.
 *
 * Not all type are currently supported, but they should be straightforward to add.
 *
 * @param swaggerType a swagger type definition, i.e., the right hand side of a swagger type definition.
 * @returns a recursive structure representing the type, which can be used as a template model.
 */

function convertType(swaggerType) {

    var typespec = _.cloneDeep(swaggerType);
    // console.log(typespec);
    if (swaggerType.hasOwnProperty('schema')) {
        return convertType(swaggerType.schema);
    } else if (_.isString(swaggerType.$ref)) {
        typespec.tsType = 'ref';
        typespec.target = swaggerType.$ref.substring(swaggerType.$ref.lastIndexOf('/') + 1);
    } else if (swaggerType.type === 'string') {
        typespec.tsType = 'string';
    } else if (swaggerType.type === 'number' || swaggerType.type === 'integer') {
        typespec.tsType = 'number';
    } else if (swaggerType.type === 'boolean') {
        typespec.tsType = 'boolean';
    } else if (swaggerType.type === 'array') {
        typespec.tsType = 'array';
        typespec.elementType = convertType(swaggerType.items);
    } else if (swaggerType.type === 'object') {
        typespec.tsType = 'any';

        typespec.properties = _.map(swaggerType.properties, function (propertyType, propertyName) {
            var property = convertType(propertyType);
            property.name = propertyName;

            return property;
        });
    } else {
        // type unknown or unsupported... just map to 'any'...
        typespec.tsType = 'any';
    }

    // Since Mustache does not provide equality checks, we need to do the case distinction via explicit booleans
    typespec.isRef = typespec.tsType === 'ref';
    typespec.isObject = typespec.tsType === 'object';
    typespec.isArray = typespec.tsType === 'array';
    typespec.isAtomic = _.contains(['string', 'number', 'boolean', 'any'], typespec.tsType);

    return typespec;
}

exports = module.exports = {
    camelCase: camelCase,
    getPathToMethodName: getPathToMethodName,
    convertType: convertType
};
