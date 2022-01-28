const { AwesomeQR } = require("awesome-qr");
const fs = require("fs");
const path = require('path');

// ...

const logo = fs.readFileSync(path.join(__dirname, "../assets/Logo.png"));

async function createShareQR(id) {
    const buffer = await new AwesomeQR({
        text: `https://mindall.herokuapp.com/${id}`,
        logoImage: logo,
    }).draw();

    fs.writeFileSync("./qr.png", buffer);

    return buffer.toString("base64");
}

module.exports = {
    createShareQR,
}