const { getExports } = require('../utils')

module.exports = () => {
  const toExport = getExports({
    dir: __dirname,
    currentFile: __filename
  });

  return toExport;
};
