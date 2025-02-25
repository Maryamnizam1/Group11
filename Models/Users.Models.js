//@degas123
const database = require("../database");
const crypto = require("crypto");

const getHash = function (password, salt){
    return crypto.pbkdf2Sync(password,salt,100000,256,"sha256").toString("hex");
};



const create_account = (user,done)=>{
    const salt = crypto.randomBytes(64);
    const hash = getHash(user.password,salt);
    const query = "INSERT INTO users(username, email, password, salt ) VALUES (?,?,?,?)";
    let users = [
        user.username ,user.email ,hash,salt.toString("hex")];
    
    database.run(query,users, function(err)
    {
        if(err)return done(err);
        return done(err,{
            id : this.lastID,
            created_at : this.moment(Date.now()).format('DD-MM-YYYY HH:mm:ss')
        });
     });
};

module.exports={
    create_account:create_account,
}