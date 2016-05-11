# rollup-plugin-bundle-worker

Bundles a single JS file alongside your main source code as the source for a
Web Worker. Provides a fallback for running the code in the main thread if the
browser does not support creating Workers from blobs.

### Getting started

```
npm install rollup-plugin-bundle-worker
```

Require the plugin and add it to your configuration:

```javascript
import bundleWorker from 'rollup-plugin-bundle-worker';

export default {
    entry: 'src/main.js',
    plugins: [ bundleWorker() ],
    format: 'umd'
};
```

For each worker that you want to create, import the file with a `worker!` prefix:

```javascript
import MyWorker from 'worker!./my-worker.js';

var myWorker = new MyWorker();
myWorker.onmessage = function (evt) {
    if (evt.data === 'hello') {
        myWorker.postMessage('hello back!');
    }
};
```

### Usage with Babel

The plugin allows your worker scripts to be transformed by the babel plugin.
However, if you specify your preset as a string in the configuration, you will
receive an error that the preset cannot be found for the worker file. Instead,
you should manually require the preset and pass it to the Babel configuration:

```javascript
import bundleWorker from 'rollup-plugin-bundle-worker';
import babel from 'rollup-plugin-babel';
import preset2015 from 'babel-preset-es2015-rollup';

export default {
    entry: 'src/main.js',
    plugins: [ bundleWorker(), babel({ presets: [ preset2015 ]}) ],
    format: 'umd'
};
```
