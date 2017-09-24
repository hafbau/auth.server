/**
 *  User schema
 *
 *  Define User Model
 *  @param {Object} connected mongoose `db`
 *  @return {Object}
 **/
const bcrypt = require('bcrypt');

module.exports = function(db) {
  // get an instance of db and db.Schema
  const Schema = db.Schema;

  const UserSchema = new Schema({
    email: { type: String,  required: true, unique: true },
    password: { type: String, required: true },
    meta: {},
    loggedIn: { type: Boolean, default: false },
    lastActive: { type: Date },
    createdAt: { type: Date, required: true, default: Date.now() },
    updatedAt: { type: Date, required: true, default: Date.now() },
  });

  // hooks
  UserSchema.pre('save', (next) => {
    if (!this.createdAt) this.createdAt = Date.now();
    if (!this.updatedAt) this.updatedAt = Date.now();
    next();
  });

  // custom helpers
  UserSchema.authenticate = ({ email, password }) => {
    return new Promise((resolve, reject) => {
      UserSchema.findOne({ where: { email } }, (err, user) => {
        if (err) return reject(err);
        if (!user) return reject({ message: "User not found" });
        bcrypt.compare(password, user.password)
          .then(matched => matched ? resolve(user) : reject({ message: "Password mismatch" }));
      });
    });
  };
  // set up a db model and pass it using module.exports
  return db.model('User', UserSchema);  
};
