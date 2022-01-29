require("dotenv").config();

const express = require("express");
const sanitize = require("xss");
const cors = require("cors");
const app = express();
const httpServer = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(httpServer);
const errorsMiddleware = require("./middlewares/errors");
const cipherRoute = require("./routes/cipher");
const shareRoute = require("./routes/share");
const { addUser, removeUser, getUser, getUserByName, getAllUsers } = require("./chatUsers");
const { encode } = require("./functions/cipher");
const db = require("./db");

//#region PUBLIC FOLDER SETUP
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');
app.set('view options', { basedir: __dirname });
app.locals.basedir = path.join(__dirname, './views');
// Using new version for app
app.use(cors({ origin: "*" }));
//#endregion

//#region MIDDLEWARES SETUP
app.use(express.json());
//#endregion

//#region ROUTING CONFIGURATION
app.use("/cipher", cipherRoute);
app.use("/share", shareRoute);
//#endregion

// Redirect any unmatched path to web page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

// * ERROR HANDLER
app.use(errorsMiddleware);

let typingUsers = [];
// * SOCKET IO
io.on("connection", socket => {
    socket.on("join:request", (username) => {
        username = sanitize(username);
        const existingUser = getUserByName(username);
        if (existingUser) {
            return socket.emit("join:reject_name");
            // TODO: Make an exception for existing user
        }
        const user = addUser(username, socket.id);
        socket.emit("join:accept", user.name);
    });

    socket.on("join:logged", () => {
        const user = getUser(socket.id);
        io.emit("join:new", user.name);
        socket.emit("users:typing", typingUsers);
        const greeting = `Привет, ${user.name}!`;
        io.emit("message:new", { username: "Mindall Chat", text: greeting });
    });

    socket.on("users:request", () => {
        const users = getAllUsers();
        socket.emit("users:list", users);
    });
    //#region messages
    socket.on("message:send", (text) => {
        text = sanitize(text);
        const encoded = encode(text);
        const user = getUser(socket.id);
        typingUsers = typingUsers.filter(u => u.id != socket.id);
        io.emit("users:typing", typingUsers);
        io.emit("message:new", { username: user.name, text: encoded, decoded: text });
    });

    socket.on("message:typing:start", () => {
        const user = getUser(socket.id);
        if (user) {
            if (!typingUsers.find(u => u.id == user.id)) {
                typingUsers.push(user);
                socket.broadcast.emit("users:typing", typingUsers);
            }
        }
    });
    socket.on("message:typing:stop", () => {
        typingUsers = typingUsers.filter(u => u.id != socket.id);
        io.emit("users:typing", typingUsers);
    });
    //#endregion


    socket.on('disconnect', () => {
        const removedUser = removeUser(socket.id);
        if (removedUser) {
            const notificationText = `Пользователь ${removedUser.name} вышел`;
            typingUsers = typingUsers.filter(u => u.id != socket.id);
            io.emit("users:typing", typingUsers);
            io.emit("message:new", { username: "Mindall chat", text: notificationText })
            io.emit("leave");
        }
    });
});

// * SERVER STARTUP
httpServer.listen(process.env.PORT, process.env.HOST, async () => {
    await db.connect();
    console.log(`Mindall App started on http://${process.env.HOST}:${process.env.PORT}`);
});