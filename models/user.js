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
    __meta_: {},
    loggedIn: { type: Boolean, default: true },
    lastActive: { type: Date },
    createdAt: { type: Date, required: true, default: Date.now() },
    updatedAt: { type: Date, required: true, default: Date.now() },
  });

  // hooks
  UserSchema.pre('save', async function(next) {
    if (!this.updatedAt) this.updatedAt = Date.now();
    if (this.password) {
      const salt = bcrypt.genSaltSync(10);
      this.password = await bcrypt.hash(this.password, salt)
    }
    // Pass control to the next
    return next();
  });

  // set up a db model and pass it using module.exports
  const User = db.model('User', UserSchema);
  // custom helpers
  User.authenticate = ({ email, password }) => {
    return new Promise((resolve, reject) => {

      User.findOne({ email }, (err, user) => {
        if (err) return reject(err);
        if (!user) return reject({ message: "User not found" });
        bcrypt.compare(password, user.password)
        .then(matched => matched ? resolve(user) : reject({ message: "Password mismatch" }));
      });
    });
  };

  return User 
};
