const decorate = require('../utils/model_decorator');

module.exports = function(db) {
  return {
    User: decorate(require('./user')(db)),
  }
}
