/* {{summary}} */
router.{{lowercase method}}('{{path}}', function(req, res) {
    {{#parameters}}
    {{#if isFormParameter}}var {{camelCaseName}} = req.form['{{name}}'];
    {{/if}}{{#if isPathParameter}}var {{camelCaseName}} = req.params['{{name}}'];
    {{/if}}{{#if isBodyParameter}}var {{camelCaseName}} = req.body;
    {{/if}}
    {{#if isQueryParameter}}var {{camelCaseName}} = req.query['{{name}}'];{{/if}}
    {{#required}}// Checking for a non-null value
    if (!{{camelCaseName}}) {
        res.status(400).end(JSON.stringify({error: '{{name}} is a required parameter'}));
        return;
    } {{/required}}
    {{/parameters}}

    try {
        result = handlers.{{methodName}}({{#parameters}}{{camelCaseName}}, {{/parameters}} req.headers);
        res.send(result);
    } catch (ex) {
        // statusCode and json should be apart of the exception
        res.status(500).end(JSON.parse(ex));
    }
});

