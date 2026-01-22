const express = require("express");
const http = require("http");
const {Server} = require("socket.io");

const path = require("path");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// serve client.html
app.get("/client1", (req, res) => {
  res.sendFile(path.join(__dirname, "client.html"));
});

app.get("/client2", (req, res) => {
  res.sendFile(path.join(__dirname, "client2.html"));
});

io.on("connection",(socket)=>{
    console.log("User Connected", socket.id);

    //send message to that user only 
    socket.emit("welcome","Welcome user ji" + socket.id);
    
    socket.on("join-room",(roomId)=>{
        // save roomId for later disconnect use
        socket.data.roomId = roomId; 

        socket.join(roomId);
        console.log(`${socket.id} joined room ${roomId}`);
         // notify others someone joined
         socket.to(roomId).emit("user-joined", { id: socket.id });
         
         //for confirmation 
         //When a user joins, you should emit a confirmation event to the client:
         socket.emit("joined-room", roomId);
    });

    socket.on("send-to-room",({msg})=>{
        const roomId = socket.data.roomId;
        console.log("room msg", roomId, msg);


        if (!roomId) {
        socket.emit("error", "You are not in any room");
        return;
        }

        io.to(roomId).emit("room-message: ", {
            msg,
            from: socket.id,
            roomId,
            time: Date.now()
        }
         );
          // OR: send to others only (excluding sender)
         // socket.to(roomId).emit("room-message", msg);
    });

    socket.on("disconnect", () => {
        const roomId = socket.data.roomId;

        if (roomId) {
            io.to(roomId).emit("user-disconnected", {
            id: socket.id
            });
        }
        });

    socket.on("leave-room", (data) => {
        console.log("User left the room : ", socket.id);
        const roomId = socket.data.roomId;
        socket.leave(roomId)
        socket.data.roomId = null

        if(roomId){
            io.to(roomId).emit("user-left",{
                id : socket.id
            });
        }else{
            return;
        }

    });
});

server.listen(3000,()=>{
    console.log("Server running at localhost:3000");
})
