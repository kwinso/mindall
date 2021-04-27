const username = document.querySelector("#username");
const loginBtn = document.querySelector("#loginBtn");
const userList = document.querySelector("#users");
const messages = document.querySelector("#messages");
const messageInput = document.querySelector("#messageText");
const sendBtn = document.querySelector("#sendBtn");

const defaultPlaceholder = "Введите имя";
const invalidNamePlaceholder = "Введите другое имя";
let loggedInState = false;
let nick = "";
let messagesAmount = 0;

let socket = io();

loginBtn.addEventListener("click", e => {
    e.preventDefault();
    if (username.value) {
        socket.emit("join:request", username.value);
        username.value = "";
    }
});

username.addEventListener("input", () => {
    if (username.placeholder != defaultPlaceholder)
        username.placeholder = defaultPlaceholder;
});

messageInput.addEventListener("input", () => {
    sendBtn.disabled = !messageInput.value;
});

sendBtn.addEventListener("click", e => {
    e.preventDefault();
    if (messageInput.value) {
        socket.emit("message:send", messageInput.value);
        messageInput.value = "";
    }

    messageInput.focus();
});


document.body.onclick = (e) => {
    e = e.target;
    if (e.className && e.className.indexOf("menu-button") >= 0) {
        console.log(e);
        const menuButton = e;

        const decoded = menuButton.getAttribute("data-text-alternative");
        const messageIndex = menuButton.getAttribute("data-to-index");
        const textToUpdate = document.querySelector(`.message[data-index="${messageIndex}"] .text`);
        const newAlternative = textToUpdate.innerText;
        menuButton.setAttribute("data-text-alternative", newAlternative);
        textToUpdate.innerText = decoded;
    }
};



function showChat() {
    document.querySelector(".login").classList.add("hidden");
    document.querySelector(".chat-container").classList.remove("hidden");
    messageInput.focus();

}

function updateUsersList(users) {
    userList.innerHTML = `<span class="username own">${nick}</span>`;

    users.forEach(u => {
        if (u.name != nick)
            userList.innerHTML += `<span class="username">${u.name}</span>`;
    });
}

function addMessage({ username, text, decoded }) {
    messagesAmount++;

    username = username.length > 30 ? username.split("").slice(0, 28).join("") + "..." : username;

    messages.innerHTML = `
        <div class="message" data-index="${messagesAmount}">
            <span class="username">${username}</span>
            <div class="text">${text}</div>      
            <div class="menu"></div>
        </div>
    ` + messages.innerHTML;
    if (decoded) {
        const menuButton = document.createElement("button");
        menuButton.classList.add("menu-button");
        menuButton.setAttribute("data-text-alternative", decoded);
        menuButton.setAttribute("data-to-index", messagesAmount);
        menuButton.innerText = "Перевести";
    
        document.querySelector(`.message[data-index="${messagesAmount}"] .menu`).appendChild(menuButton);
    
        messages.scrollTop = messages.scrollHeight;
    }
}

// * SOCKETS
socket.on("join:new", () => {
    socket.emit("users:request");
});
socket.on("leave", () => {
    socket.emit("users:request");
});

socket.on("users:list", (users) => {
    updateUsersList(users);
});

socket.on("message:new", (message) => {
    addMessage(message);
});

socket.on("join:accept", (name) => {
    nick = name;
    loggedInState = true;
    socket.emit("join:logged");
    showChat();
});

socket.on("join:reject_name", () => {
    username.placeholder = invalidNamePlaceholder;
});