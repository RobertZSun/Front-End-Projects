const bcrypt = require('bcrypt');


async function encrypt() {
    let randomString = await bcrypt.genSalt(10);
    console.log(randomString,'\n');
    let encryptedPassword = await bcrypt.hash('123456', randomString);
    console.log(encryptedPassword);
}

encrypt();