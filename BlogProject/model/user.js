// import modules
const mongoose = require('mongoose');
// encryption model
const bcrypt = require('bcrypt');
const Joi = require('joi');

/**
 * define user object attributes and values requirements
 * */
const userObj = {
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    email: {
        type: String,
        unique: true, // make sure the email is unique
        required: true,
    },
    password: {
        type: String,
        required: true,
    },

    // admin superUser, normal just normal user
    role: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        default: 0 // 0 => enabled,  1 => disabled
    },
}

// initialize the schema of user
const userSchema = new mongoose.Schema(userObj);

// create a user collection named userSchema
const User = mongoose.model('User', userSchema);


// initialize the first user
let initialUserObject = {
    username: 'RobertZSun',
    email: 'robertsunzhe@hotmail.com',
    password: '123456',
    role: 'admin',
    status: 0
}

async function create_A_User(initialUserObject) {
    let createdUser = null;
    let randomString = await bcrypt.genSalt(10);
    initialUserObject.password = await bcrypt.hash(initialUserObject.password, randomString);
    await User.create(initialUserObject).then((result) => {
        createdUser = result;
        console.log(`user ${initialUserObject.username} --- ${initialUserObject.email} created success`);
    }).catch((err) => {
        console.log("user created failed");
    });
    return createdUser;
}
// create_A_User(initialUserObject);

// verification user information
const validateUser = (currentUserInfo)=>{
    const schema = {
        username: Joi.string().alphanum().min(2).max(20).required().error(new Error('username must be min 2 characters and max 20 characters, should be alphanumeric')),
        email: Joi.string().email().required().error(new Error('the format of email is not correct')),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required().error(new Error('password should be between 3 to 30 Characters, and they should be a-z,A-Z, 0-9 within this range')),
        role: Joi.string().valid('normal', 'admin').required().error(new Error('role should be either admin or normal')),
        status: Joi.number().valid(0, 1).required().error(new Error('status should be either enabled or disabled')),
    }
    return Joi.validate(currentUserInfo, schema);
}

module.exports.User = User;
module.exports.create_A_User = create_A_User;
module.exports.validateUser = validateUser;