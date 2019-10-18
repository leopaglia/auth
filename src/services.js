const bcrypt = require("bcryptjs");
const { BadRequest, NotFound, Unauthorized } = require("http-errors");

module.exports = db => {
  const repository = require("./repository")(db);

  return {
    createUser,
    getByEmailAndPassword,
    getById,
    changePassword
  };

  function createUser({ email, password, firstName, lastName }) {
    return repository.findOne({ email }).then(user => {
      if (user) return Promise.reject(BadRequest("Email already in use"));
      return encryptPassword(password).then(encryptedPassword => {
        return repository.create({
          email,
          password: encryptedPassword,
          firstname: firstName,
          lastname: lastName
        });
      });
    });
  }

  function getByEmailAndPassword(email, password) {
    return repository
      .findOne({ email }, { withPrivateFields: true })
      .then(user => {
        if (!user) return Promise.reject(NotFound("User not found"));

        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch)
            return Promise.reject(Unauthorized("Incorrect password"));
          return user;
        });
      });
  }

  function getById(id) {
    return repository.findById(id).then(user => {
      if (!user) return Promise.reject(NotFound("User not found"));
      return user;
    });
  }

  function changePassword(id, newPassword) {
    return repository.findById(id).then(user => {
      if (!user) return Promise.reject(NotFound("User not found"));
      return encryptPassword(newPassword).then(encryptedPassword => {
        return repository.update(id, { password: encryptedPassword });
      });
    });
  }

  function encryptPassword(unencryptedPassword) {
    const SALT_FACTOR = 5;
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) return reject("Error saving user");
        bcrypt.hash(unencryptedPassword, salt, (err, hash) => {
          if (err) return reject("Error saving user");
          return resolve(hash);
        });
      });
    });
  }
};
