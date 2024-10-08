const {Transform} = require('stream');

exports.append = function(properties, features) {
  return new Transform({
    objectMode: true,
    transform: function(file, env, cb) {
      if (file.isBuffer()) {
        if (file.extname === '.ext') {
          // change .ext to .ts or .js file
          file.extname = features.includes('typescript') ? '.ts' : '.js';
        } else if (features.includes('css-module')) {
          if (['.css', '.scss'].includes(file.extname)) {
            file.extname = `.module${file.extname}`;
          }
        }
      }
      cb(null, file);
    }
  });
};
