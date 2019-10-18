const express = require("express");

const router = express.Router();

module.exports = db => {
  const {
    getUserById,
    changePassword,
    login,
    register
  } = require("./controller")(db);
  const { requireAuth, requireLogin } = require("./middlewares")(db);

  router.post("/register", register);
  router.post("/login", requireLogin, login);

  router.get("/users/:id", requireAuth, getUserById);
  router.patch("/users/:id", requireAuth, changePassword);

  return router;
};
