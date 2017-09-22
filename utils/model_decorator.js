module.exports = (model) => {
  try {
    model.cache = {}; // setup cache on models


  }
  catch (err) {
    console.log("model decoration error", err.message);
  }
  
  return model
}
