module.exports = (models, render) => ({
  auth: require('./auth')(models, render),
  root: require('./root')(models, render),
})
