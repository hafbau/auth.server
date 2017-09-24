module.exports = function(db) {
  // get an instance of db and db.Schema
  const Schema = db.Schema;

  const UserSchema = new Schema({
    email: { type: String,  required: true },
    password: { type: String, required: true },
    meta: {}
  })

  // set up a db model and pass it using module.exports
  return db.model('User', UserSchema);  
};
