var fs = require('fs'),
    path = require('path'),
    rollup = require('rollup'),
    paths = new Map();

module.exports = function () {
    var opts = {};
    var plugin = {
        resolveId: function (importee, importer) {
            if (importee === 'rollup-plugin-bundle-worker') {
                return path.resolve(__dirname, 'workerhelper.js');
            }
            else if (importee.indexOf('worker!') === 0) {
                var name = importee.split('!')[1],
                    target = path.resolve(path.dirname(importer), name);

                paths.set(target, name);
                return target;
            }
        },

        options: function (_opts) {
            opts = Object.assign({}, _opts);
            opts.plugins = opts.plugins.slice();

            var idx = opts.plugins.indexOf(plugin);
            if (idx !== -1) opts.plugins.splice(idx, 1);

            delete opts.moduleName;
            delete opts.dest;
        },

        /**
         * Do everything in load so that code loaded by the plugin can still be transformed by the
         * rollup configuration
         */
        load: function (id) {
            if (!paths.has(id)) {
                return;
            }

            var localOpts = Object.assign({}, opts, {
                entry: id
            });

            return rollup.rollup(localOpts).then(function (result) {
                return [
                    `import shimWorker from 'rollup-plugin-bundle-worker';`,
                    `export default new shimWorker(${JSON.stringify(paths.get(id))}, function (window, document) {`,
                    `var self = this;`,
                    result.generate({ format: 'es' }).code,
                    `\n});`
                ].join('\n');
            });
        }
    };

    return plugin;
}
