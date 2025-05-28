// user.middlewares.js

const validator = require('validator')

exports.validateLogin = (req, res, next) => {
    const {email, password} = req.body;

    if(!password){
        return res.status(400).json({message: 'Entry field for password'});
    }

    if(!email || !validator.isEmail(email)){
        return res.status(400).json({message: 'Invalid entry for email'});
    }
    next();
}