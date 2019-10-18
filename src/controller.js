const jwt = require("jsonwebtoken");
const config = require("./config");

module.exports = db => {
  const services = require("./services")(db);

  return {
    login,
    register,
    changePassword,
    getUserById
  };

  function getUserById(req, res, next) {
    return services
      .getById(req.params.id)
      .then(user => res.status(200).json(user))
      .catch(next);
  }

  function changePassword(req, res, next) {
    return services
      .changePassword(req.params.id, req.body.password)
      .then(user => res.status(200).json(user))
      .catch(next);
  }

  function register(req, res, next) {
    const { firstName, lastName, email, password } = req.body;
    const userData = { firstName, lastName, email, password };
    return services
      .createUser(userData)
      .then(newUser => {
        const { id, firstName, lastName, email } = newUser;
        const newUserData = { id, firstName, lastName, email };
        const token = generateToken(newUserData);
        return res.status(201).json({ token, user: newUserData });
      })
      .catch(next);
  }

  function login(req, res) {
    const { id, firstname, lastname, email } = req.user;
    const userData = { id, firstName: firstname, lastName: lastname, email };
    const token = generateToken(userData);
    return res.status(200).json({ token, user: userData });
  }

  function generateToken(user) {
    const token = jwt.sign(user, config.jwt_secret, {
      expiresIn: config.jwt_exp
    });
    return `JWT ${token}`;
  }
};
