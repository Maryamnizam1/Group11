//@degas123
const Users = require("../Models/Users.Models");
const Joi = require("joi");
const password = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\%\^\&\*\(\)\-\+\!]).{4,20}$");


// creates the users account. auther @James 
const create_account = (req, res) => {

    const schema = Joi.object({
        username: Joi.string().min(4).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: Joi.string().regex(password).required()
    })
    const { error } = schema.validate(req.body);

    if (error) return res.status(400).send(
        { "error_message": error.details[0].message }
    );
      Users.create_account(users, (err, user) => {
        if (err) {
            if (err.errno == 19) {
                // sqlite error for the duplication of a email adderss.(primery key)
                return res.status(400).send({ "error_message": `Email '${users.email}' already has an account.` });
            }
            else {
                return res.sendStatus(500);
            }
        }
        return res.status(201).send(user);
    })
}

const login = (req, res)=>{
    const schema = Joi.object({
        // what are we using for the login detales
        email: Joi.string().required(),
        password: Joi.string().required()
    })
    const {err} = schema.validate(req.body);
    if (err) return res.status(400).send({ "error message is ": err.details[0].message})
    // adding modules now
}









module.exports={
    create_account: create_account,
}