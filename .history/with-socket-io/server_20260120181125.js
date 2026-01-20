//in socket.io serve the html using express by adding path and the "/" route so you aren't cors blocked 



const express = require('express');
const http = require("http");
const {Server} = require("socket.io");

const path = require('path');
const app = express();

const server = http.createServer(app);


// serve client.html
app.get("/client1", (req, res) => {
  res.sendFile(path.join(__dirname, "client.html"));
});

app.get("/client2", (req, res) => {
  res.sendFile(path.join(__dirname, "client1.html"));
});

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
    console.log("Server running on http://localhost:3000");
})