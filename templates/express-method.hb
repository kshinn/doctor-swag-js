/* {{summary}} */
router.{{lowercase method}}('{{expressPath path}}', function(req, res) {
    {{#parameters}}
    {{#if isFormParameter}}var {{camelCaseName}} = req.body['{{name}}'];
    {{/if}}{{#if isPathParameter}}var {{camelCaseName}} = req.params['{{name}}'];
    {{/if}}{{#if isBodyParameter}}var {{camelCaseName}} = req.body;
    {{/if}}
    {{#if isQueryParameter}}var {{camelCaseName}} = req.query['{{name}}'];{{/if}}
    {{#required}}// Checking for a non-null value
    if (!{{camelCaseName}}) {
        res.status(400).send({error: '{{name}} is a required parameter'});
        return;
    } {{/required}}
    {{/parameters}}

    try {
        handlers.{{methodName}}({{#parameters}}{{camelCaseName}}, {{/parameters}} req.headers)
        .then(function(result) {
            res.send(result);
        }, function(err) {
            res.status(err.statusCode).send(err.message);
        });
    } catch (ex) {
        // statusCode and json should be apart of the exception
        res.status(500).send(ex);
    }
});

