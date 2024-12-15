const socket = io();
const msgForm = document.querySelector("#msg-form");
const msgInput = document.querySelector("input");
const sendBtn = document.querySelector("button");
const messages = document.querySelector("#messeges");
const userList = document.querySelector("#user-list");

socket.on("msg", (message) => {
    const html = `<p id="b1">${message}</p>`;
    messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locmsg", (url) => {
    const html = `<p id="b2"><a href="${url}" target="_blank">Shared Location</a></p>`;
    messages.insertAdjacentHTML("beforeend", html);
});

// Update the user list
socket.on("roomdata", ({ room, users }) => {
    console.log("Room:", room);
    console.log("Users:", users);

    userList.innerHTML = ""; // Clear the current list
    users.forEach((user) => {
        const listItem = document.createElement("li");
        listItem.textContent = user.Name;
        userList.appendChild(listItem);
    });
});

// Handle message form submission
msgForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const message = e.target.elements.messege.value;
    socket.emit("sendmsg", message, (error) => {
        if (error) {
            console.error(error);
        } else {
            msgInput.value = "";
            msgInput.focus();
        }
    });
});

// Handle location sharing
document.querySelector("#sendLoc").addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser.");
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("sendloc", position, () => {
            console.log("Location shared!");
        });
    });
});

// Join room
const params = new URLSearchParams(window.location.search);
const Name = params.get("displayName");
const room = params.get("room");

socket.emit("join", { Name, room }, (error) => {
    if (error) {
        alert(error);
        location.href = "/";
    }
});
