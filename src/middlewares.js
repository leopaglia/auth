const passport = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");
const LocalStrategy = require("passport-local");
const config = require("./config");

const localOptions = { usernameField: "email" };

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: config.jwt_secret
};

module.exports = db => {
  const services = require("./services")(db);

  const emailAndPasswordLogin = (email, password, done) =>
    services
      .getByEmailAndPassword(email, password)
      .then(user => done(null, user))
      .catch(done);

  const jwtLogin = (payload, done) =>
    services
      .getById(payload.id)
      .then(user => done(null, user))
      .catch(() => done(null, false));

  const localStrategy = new LocalStrategy(localOptions, emailAndPasswordLogin);
  const jwtStrategy = new Strategy(jwtOptions, jwtLogin);

  passport.use(localStrategy);
  passport.use(jwtStrategy);

  return {
    requireLogin: passport.authenticate("local", { session: false }),
    requireAuth: passport.authenticate("jwt", { session: false })
  };
};
