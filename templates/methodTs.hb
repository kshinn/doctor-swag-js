{{#summary}}/*{{&summary}}*/{{/summary}}
public {{ methodName }} ({{#parameters}}{{name}}:{{type}}, {{/parameters}}extraHttpRequestParams?: any): ng.IHttpPromise<{{{ response.resolveType }}}> => {
    // Fill this out with q params
    let queryParams: any {};
    let headerParams: any = this.extendObj({}, this.defaultHeaders);

    let httpRequestParams: any = {
        params: queryParams,
        headers: headerParams
    };

    if (extraHttpRequestParams) {
        httpRequestParams = this.extendObj(httpRequestParams, extraHttpRequestParams);
    }

    return this.$http(httpRequestParams);
}