/// <reference path="api.d.ts" />

namespace {{moduleName}} {
    'use strict';

    export interface {{name}} {
        {{#properties}}
        {{#description}}/**
         * {{{.}}}
         **/{{/description}}
        {{name}}: {{ formatPropertyType . }};

        {{/properties}}
    }
}