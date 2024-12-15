const users = [];

const addUser = ({ id, Name, room }) => {
    Name = Name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if (!Name || !room) {
        return {
            error: "User or room or both are invalid"
        };
    }

    const existingUser = users.find((u) => u.room === room && u.Name === Name);
    if (existingUser) {
        return {
            error: "Username is already in use"
        };
    }

    const newUser = { id, Name, room };
    users.push(newUser);
    
    return {newUser};
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }

    return null;
};
const getUser = (id) => {
    return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
    return users.filter((u) => u.room === room);
};

module.exports ={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}