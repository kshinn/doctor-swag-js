{{#summary}}/*{{{summary}}}*/{{/summary}}
public {{ methodName }} ({{#parameters}}{{name}}{{^required}}?{{/required}}:{{type}}, {{/parameters}}extraHttpRequestParams?: any): ng.IHttpPromise<{{{ responseType }}}> => {
    {{#if hasPathParameter}}
    const path = this.basePath + "{{path}}"
    {{#parameters}}{{#if_eq in 'path'}}    .replace('{' + {{name}} + '}', String({{name}})){{/if_eq}}{{/parameters}};
    {{else}}
    const path = this.basePath + "{{path}}";
    {{/if}}

    // Fill this out with q params
    let queryParams: any {};
    let headerParams: any = this.extendObj({}, this.defaultHeaders);

    {{#parameters}}
    {{#if required }}
    if (!{{{name}}}) {
        throw new Error('Missing required parameter {{{name}}} when calling {{{../methodName}}}');
    }
    {{/if}}

    {{/parameters}}
    let httpRequestParams: any = {
        method: {{method}},
        url: path,
        json: true,

        params: queryParams,
        headers: headerParams
    };

    if (extraHttpRequestParams) {
        httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
    }

    return this.$http(httpRequestParams);
}