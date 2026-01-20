const express = require("express");
const http = require("http");
const {Server} = require("socket.io");

const path = require("path");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// serve client.html
app.get("/client1", (req, res) => {
  res.sendFile(path.join(__dirname, "client1.html"));
});

app.get("/client2", (req, res) => {
  res.sendFile(path.join(__dirname, "client1.html"));
});

io.on("connection",(socket)=>{
    console.log("User Connected", socket.id);
    //send message to that user only 
    socket.emit("welcome","Welcome user ji" + socket.id);

    socket.on("join-room",(roomId)=>{
        socket.join(roomId);
        console.log(`${socket.id} joined room ${roomId}`);

        //for confirmation 
        //When a user joins, you should emit a confirmation event to the client:
        socket.emit("joined-room", roomId);
    });

    socket.on("send-to-room",({roomId, msg})=>{
        console.log("room msg", roomId, msg);

        io.to(roomId).emit("room-message : ", msg );
          // OR: send to others only (excluding sender)
         // socket.to(roomId).emit("room-message", msg);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    });
});

server.listen(3000,()=>{
    console.log("Server running at localhost:3000");
})
