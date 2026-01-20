
const express = require('express');
const http = require("http");
const {Server} = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection",(socket)=>{
    console.log("User Connected", socket.id);

    //send message to that user only 
    socket.emit("welcome","Welcome user ji" + socket.id);

    socket.on("chat-message",(msg)=>{
        console.log("Message: ",msg);

        //broadcast to all users
        io.emit("chat-message",msg);
    })

    socket.on("disconnect",()=>{
        console.log("User disconnected" + socket.id);
    });
});

server.listen(3000,()=>{
    console.log("Server running on http://localhost:8080");
})