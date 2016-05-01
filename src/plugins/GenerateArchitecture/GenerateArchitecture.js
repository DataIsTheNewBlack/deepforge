/*globals define*/
/*jshint node:true, browser:true*/

/**
 * Generated by PluginGenerator 0.14.0 from webgme on Sun Mar 20 2016 16:49:12 GMT-0500 (CDT).
 */

define([
    'SimpleNodes/SimpleNodes',
    'SimpleNodes/Constants',
    'deepforge/layer-args',
    './dimensionality',
    'underscore'
], function (
    PluginBase,
    Constants,
    createLayerDict,
    dimensionality,
    _
) {
    'use strict';

    /**
     * Initializes a new instance of GenerateArchitecture.
     * @class
     * @augments {PluginBase}
     * @classdesc This class represents the plugin GenerateArchitecture.
     * @constructor
     */
    var GenerateArchitecture = function () {
        // Call base class' constructor.
        PluginBase.call(this);
    };

    // Prototypal inheritance from PluginBase.
    GenerateArchitecture.prototype = Object.create(PluginBase.prototype);
    GenerateArchitecture.prototype.constructor = GenerateArchitecture;

    /**
     * Gets the name of the GenerateArchitecture.
     * @returns {string} The name of the plugin.
     * @public
     */
    GenerateArchitecture.prototype.getName = function () {
        return 'GenerateArchitecture';
    };

    /**
     * Gets the semantic version (semver.org) of the GenerateArchitecture.
     * @returns {string} The version of the plugin.
     * @public
     */
    GenerateArchitecture.prototype.getVersion = function () {
        return '0.1.0';
    };

    GenerateArchitecture.prototype.main = function () {
        this.LayerDict = createLayerDict(this.core, this.META);
        return PluginBase.prototype.main.apply(this, arguments);
    };

    GenerateArchitecture.prototype.createOutputFiles = function (tree) {
        var layers = tree[Constants.CHILDREN],
            result = {},
            template,
            snippet,
            code,
            args;

        code = [
            'require \'nn\'',
            '',
            'local net = nn.Sequential()'
        ].join('\n');

        // Start with sequential (just one input)
        for (var i = 0; i < layers.length; i++) {
            if (layers[i][Constants.NEXT].length > 1) {
                // no support for 
                console.error('No support for parallel layers... yet');
                break;
            } else {
                // args
                args = this.createArgString(layers[i]);
                template = _.template('net:add(nn.{{= name }}' + args + ')');
                snippet = template(layers[i]);
                code += '\n' + snippet;
            }
        }

        code += '\n\nreturn net';

        result[tree.name + '.lua'] = code;
        return result;
    };

    GenerateArchitecture.prototype.createArgString = function (layer) {
        return '(' + this.LayerDict[layer.name].map(arg => {
            var value = layer[arg.name];
            // Infer if value is unset and infer.dimensionality is set
            if (!value && arg.infer === 'dimensionality') {
                value = dimensionality(layer[Constants.PREV][0]);
            }
            return value;
        }).join(', ') + ')';
    };

    return GenerateArchitecture;
});
