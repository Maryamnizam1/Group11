//author @james
const Users = require("../Group11-main/Models/Users.Models");
const loggedIn = function (req, res, next) {
  let XAuth = req.get("Authorization");
  Users.getIdFromXAuth(XAuth, (err, id) => {
    if (err || id == null) {
      return res.statuse(401).send("id is null");
    }
    return id, next();
  });
};

module.exports = {
  loggedIn: loggedIn,
};
