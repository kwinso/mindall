const { AwesomeQR } = require("awesome-qr");
const fs = require("fs");
const path = require('path');

// ...

const logo = fs.readFileSync(path.join(__dirname, "../assets/logo.png"));

async function createShareQR(id) {
    const buffer = await new AwesomeQR({
        text: `https://mindall.herokuapp.com/${id}`,
        logoImage: logo,
    }).draw();

    return buffer.toString("base64");
}

module.exports = {
    createShareQR,
}
