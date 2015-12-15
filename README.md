# Doctor Swag

This is a node module that functions as an extensible code generator for Swagger 2.0. It is based on wcandillon's excellent module https://github.com/wcandillon/swagger-js-codegen. This module represents a fairly large internal structural change while trying to maintain compatibility with the original module (Swagger 1.x support was dropped).

## Additional Features
* Users swagger-tools to validate the in bound swagger document
* Has an extensible Pipeline to add new processing stages (for processing the template data) and renderers (new languages / frameworks).
* Upgrades the mustache rendering lib to handlebars
* Adds Typescript (Angular) support by default