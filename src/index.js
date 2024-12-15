const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const Filter = require("bad-words");
const path = require("path");
const { addUser, removeUser, getUsersInRoom,getUser } = require("./utils/user");

const app = express();
const port = 3000;
const PublicPath = path.join(__dirname, "../public");
app.use(express.static(PublicPath));

const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
    console.log("New WebSocket connection");

    socket.on("join", ({ Name, room }, cb) => {
        const { error, newUser } = addUser({ id: socket.id, Name, room });
        if (error) return cb(error);

        socket.join(newUser.room);

        // Notify the user
        socket.emit("msg", "Welcome!");

        // Notify other users in the room
        socket.broadcast.to(newUser.room).emit("msg", `${newUser.Name} has joined`);

        // Send updated user list to the room
        io.to(newUser.room).emit("roomdata", {
            room: newUser.room,
            users: getUsersInRoom(newUser.room),
        });

        cb();
    });

    
     socket.on("sendmsg",(m,cb)=>{
        const filter = new Filter()
        if(filter.isProfane(m)){
            return cb("profanity not allowed")
        }
        io.emit("msg",m)
        cb()
     })

     socket.on("disconnect",()=>{
        const user =  removeUser(socket.id)
        if(user){
            io.to(user.room).emit("msg",`${user.Name} left`) 
            socket.on("roomdata", ({ room, users }) => {
                console.log("Room:", room);
                console.log("Users:", users);
                const userList = document.querySelector("#user-list");
                userList.innerHTML = "";
                users.forEach((user) => {
                    const listItem = document.createElement("li");
                    listItem.textContent = user.Name;
                    userList.appendChild(listItem);
                });
            });
            
        }
     })
     socket.on("sendloc",(p,cb)=>{
        let m = "https://google.com/maps?q="+(p.coords.latitude)+","+(p.coords.longitude)
        io.emit("locmsg",m)
        cb("location shared")
     })
})

server.listen(port,(req,res)=>{
    console.log("listening in port 3000")
})
