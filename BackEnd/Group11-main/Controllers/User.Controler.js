//@degas123
const { reinstall } = require("npm-git-install");
const Users = require("../Models/Users.Models");
const Joi = require("joi");
const password = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[%^&*()-+!]).{4,20}$"
);

// creates the users account. auther @James
const create_account = (req, res) => {
  const schema = Joi.object({
    username: Joi.string().min(4).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: Joi.string().regex(password).required(),
  });
  const { error } = schema.validate(req.body);

  if (error)
    return res.status(400).send({ error_message: error.details[0].message });
  let users = Object.assign({}, req.body);
  Users.create_account(users, (err, user) => {
    if (err) {
      if (err.errno == 19) {
        return res.status(400).send({
          error_message: `Email '${users.email}' already has an account.`,
        });
      } else {
        return res.status(500).send(err);
      }
    }
    return res.status(201).send(user);
  });
};

const login = (req, res) => {
  const schema = Joi.object({
    // what are we using for the login detales
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  const { err } = schema.validate(req.body);
  if (err)
    return res
      .status(400)
      .send({ "error message is ": err.details[0].message });
  Users.signedUp(req.body.email, req.body.password, (err, id) => {
    if (err === 404)
      return res
        .status(400)
        .send({ error_message: "Invalid email/Password supplied" });
    if (err) return res.sendStatus(500);

    Users.getLoginToken(id, (err, token) => {
      if (err) return res.sendStatus(500);
      if (token) {
        return res.status(200).send({ id: id, loginToken: token });
      } else {
        Users.setLoginToken(id, (err, token) => {
          if (err) return res.sendStatus(500);
          return res.status(200).send({ id: id, loginToken: token });
        });
      }
    });
  });
};

const logout = (req, res) => {
  let token = req.get("Authorization");
  Users.getId(token, function (err, id) {
    if (!id) {
      return res.sendStatus(401);
    }
    if (err) return res.sendStatus(500);
    Users.removeLoginToken(token, (err) => {
      if (err) {
        return res.sendStatus(500);
      } else {
        return res.sendStatus(200);
      }
    });
  });
};
module.exports = {
  create_account: create_account,
  login: login,
  logout: logout,
};
