/// <reference path="api.d.ts" />

/* tslint:disable:no-unused-variable member-ordering */

module {{moduleName}} {
    'use strict';

    export class {{className}} {
        {{#domain}}protected basePath = "{{{domain}}}";{{/domain}}
        public defaultHeaders: any = {};

        public static $inject = ["$http", "$httpParamSerializer"];

        constructor(protected $http: ng.IHttpService,
                    protected $httpParamSerializer?: (d: any) => any,
                    basePath?: string)
        {
            if (basePath) {
                this.basePath = basePath;
            }
        }

        private extendObj<T1,T2>(objA: T1, objB: T2) {
            for(let key in objB){
                if(objB.hasOwnProperty(key)){
                    objA[key] = objB[key];
                }
            }
            return <T1&T2>objA;
        }

        {{#methods}}
        {{> methodTs}}

        {{/methods}}
    }
}