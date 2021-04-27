let users = [];

function addUser(name, id) {
    const user = { name, id };
    users.push(user);

    return user;
}

function removeUser(id) {
    const removedUser = getUser(id);
    users = users.filter(u => u.id != id);
    
    return removedUser;
}

function getUser(id) {
    return users.find(u => u.id == id);
}

function getUserByName(name) {
    return users.find(u => u.name == name);
}

function getAllUsers() { return users; }

module.exports = {
    addUser, 
    removeUser,
    getUser,
    getUserByName,
    getAllUsers
}