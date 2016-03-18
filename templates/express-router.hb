/* * *
 * Generated express router
 *
 * Description: {{description}}
 * Rendered for: {{domain}}
 */

var express = require('express'),
    router = express.Router(),
    handlers = require('./handlers');

{{#methods}}
{{> expressMethod}}
{{/methods}}

exports = module.exports = router;