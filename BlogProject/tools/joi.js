const Joi = require('joi');

const schema = {
    username: Joi.string().alphanum().min(2).max(20).required().error(new Error('must be min 2 characters and max 20 characters, should be alphanumeric')),
    birth: Joi.number().min(1900).max(2020).required().error(new Error('year of age should be between 1900 and 2020')),
}


async function run() {
    try {
        await Joi.validate({
            username: 'robert',
            birth: 1980,
        }, schema);
    } catch (error) {
        console.log(error);
        return;
    }
    console.log("pass!");
}

run();