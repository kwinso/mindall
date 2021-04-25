require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const errorsMiddleware = require("./middlewares/errors");
const cipherRoute = require("./routes/cipher");

//#region PUBLIC FOLDER SETUP
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');
app.set('view options', { basedir: __dirname});
app.locals.basedir = path.join(__dirname, './views');
app.use("/public", express.static(path.join(__dirname, 'public')));
//#endregion

//#region MIDDLEWARES SETUP
app.use(express.json());
//#endregion

//#region ROUTING CONFIGURATION
app.get("/", (_, res) => {
    res.render("index");
});
app.use("/cipher", cipherRoute);
//#endregion

// * ERROR HANDLER
app.use(errorsMiddleware);

// * SERVER STARTUP
app.listen(process.env.PORT, "192.168.0.107", () => {
    console.log(`Mindall App started on http://localhost:8080`);
});