//@degas123
const database = require("../../database");
const crypto = require("crypto");

const getHash = function (password, salt) {
  return crypto
    .pbkdf2Sync(password, salt, 100000, 256, "sha256")
    .toString("hex");
};

const create_account = (user, done) => {
  const salt = crypto.randomBytes(64);
  const hash = getHash(user.password, salt);
  const query =
    "INSERT INTO users (username, email, password, salt) VALUES (?,?,?,?)";
  let users = [user.username, user.email, hash, salt.toString("hex")];

  database.run(query, users, function (err) {
    if (err) {
      return done(err);
    }

    return done(err, {
      id: this.lastID,
    });
  });
};

const signedUp = (email, password, done) => {
  const query = "SELECT id, password, salt FROM users WHERE email=?";

  database.get(query, [email], (err, row) => {
    if (err) return done(err);
    if (!row) return done(404); // incorrect email adress.
    if (row.salt === null) row.salt == "";

    let salt = Buffer.from(row.salt, "hex");
    if (row.password === getHash(password, salt)) {
      return done(false, row.id);
    } else {
      return done(404); // incorrect password.
    }
  });
};

const setLoginToken = (id, done) => {
  let token = crypto.randomBytes(16).toString("hex");
  const query = "UPDATE users SET loginToken=? WHERE id=?";

  db.run(query, [token, id], (err) => {
    return done(err, token);
  });
};

const getLoginToken = (id, done) => {
  const query = "SELECT loginToken FROM users WHERE id=?";
  db.get(query, [id], function (err, row) {
    if (row && row.loginToken) {
      return done(null, row.loginToken);
    } else {
      return done(null, null);
    }
  });
};

module.exports = {
  create_account: create_account,
  signedUp: signedUp,
  setLoginToken: setLoginToken,
  getLoginToken: getLoginToken,
};
