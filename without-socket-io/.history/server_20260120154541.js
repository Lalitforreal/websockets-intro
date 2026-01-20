//this is the websockets server

const Websockets = require("ws");

const wss = new Websockets.Server({port : 8080});

let clients = new Set(); // created a set for unique values

wss.on("connection",(ws)=>{
    console.log("New client connected")
    ws.send(JSON.stringify({type : "welcome", msg : `hey welcome the time currently is ${new Date()} `}));

    //when client sends something
    ws.on("message", (message)=>{
        console.log("Client : ", message.toString());
        //broadcast to every client
        for(client in clients){
            if(client.readyState === Websockets.OPEN){
                client.send(
                    JSON.stringify(
                        {
                            type : "broadcast",
                            msg : message.toString()
                        }
                    )
                )
            }
        }
    });

    ws.on("close",()=>{
        console.log("Client disconnected");
        clients.delete(ws);
    })
});



console.log("Websocket server running on ws://localhost:8080");