const { getExports } = require('../utils')

module.exports = (options) => {
  const toExport = getExports({
    dir: __dirname,
    currentFile: __filename
  }, options);

  return toExport;
};
