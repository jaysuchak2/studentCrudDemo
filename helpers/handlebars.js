var blockScript = {};
var blockCss = {};
var Handlebars = require('handlebars');
var helpers = require('handlebars-helpers')({
    handlebars: Handlebars
});
var paginateHelper = require('express-handlebars-paginate');
//Register Helper
Handlebars.registerHelper('paginateHelper', paginateHelper);
const fs = require('fs');

module.exports = {
    defaultLayout: 'default',
    extname: '.hbs',
    // Specify helpers which are only registered on this instance.
    helpers: {
        /**
         * helper function for debug view variables into server log
         * @param  {string}
         * @return {null|void}
         */
        debug: function (data) {
            console.log(data);
        },
        paginateHelper: paginateHelper.createPagination,
        /**
         * retrieve script from_block script var and add into layout at given position
         * @param  {string}
         * @return {string}
         */
        getScript: function (position) {
            var str = "";
            if (typeof blockScript[position] != 'undefined') {
                for (i = 0; i < blockScript[position].length; i++) {
                    str += '<script src="' + blockScript[position][i] + '"></script>'
                }
                blockScript[position] = [];
            }
            return new Handlebars.SafeString(str);
        },
        // Function to do basic mathematical operation in handlebar
        math: function (lvalue, operator, rvalue) {
            lvalue = parseFloat(lvalue);
            rvalue = parseFloat(rvalue);
            return {
                "+": lvalue + rvalue,
                "-": lvalue - rvalue,
                "*": lvalue * rvalue,
                "/": lvalue / rvalue,
                "%": lvalue % rvalue
            } [operator];
        },
        /**
         * retrieve script from_block script var and add into layout at given position
         * @param  {string}
         * @return {string}
         */
        getCss: function (position) {
            var str = "";
            if (typeof blockCss[position] != 'undefined') {
                for (i = 0; i < blockCss[position].length; i++) {
                    str += '<link rel="stylesheet" href="' + blockCss[position][i] + '" />'
                }
                blockCss[position] = [];
            }
            return new Handlebars.SafeString(str);
        },
        /**
         * load javascript file into particular position
         * @param  {string} position identifier
         * @param  {string|array} set of script path
         * @return {null}
         */
        setScript: function () {
            var args = [];
            for (i in arguments) {
                if (typeof arguments[i] == "string")
                    args.push(arguments[i]);
            };
            var position = args.shift();
            if (typeof blockScript[position] == 'undefined') {
                blockScript[position] = [];
            }
            blockScript[position] = blockScript[position].concat(args);
        },
        /**
         * load javascript file into particular position
         * @param  {string} position identifier
         * @param  {string|array} set of script path
         * @return {null}
         */
        setCss: function () {
            var args = [];
            for (i in arguments) {
                if (typeof arguments[i] == "string")
                    args.push(arguments[i]);
            };
            var position = args.shift();
            if (typeof blockCss[position] == 'undefined') {
                blockCss[position] = [];
            }
            blockCss[position] = blockCss[position].concat(args);
        }
    }
};