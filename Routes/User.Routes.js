//@degas123
const Users = require("../Controllers/User.Controler")
const auth = require("../Lib/Middleware")

module.exports= function(app){
    app.route("/users").post(Users.create_account);
}