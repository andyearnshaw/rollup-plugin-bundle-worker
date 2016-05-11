const babel = require('rollup-plugin-babel');

module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        rollup: {
            options: {
                sourceMap: true,
                format: 'cjs',
                plugins: [
                    babel({ presets: ['es2015-rollup'] })
                ]
            },
            main: {
                files: {
                    'index.js':'src/index.js'
                }
            },
            helper: {
                options: {
                    exports: 'named'
                },
                files: {
                    'workerhelper.js':'src/workerhelper.js'
                }
            }
        }
    });

    for (var key in grunt.file.readJSON("package.json").devDependencies) {
        if (key !== "grunt" && key.indexOf("grunt") === 0) {
            grunt.loadNpmTasks(key);
        }
    }
}

