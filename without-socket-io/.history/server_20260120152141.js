//this is the websockets server

const Websockets = require("ws");

const wss = new Websockets.Server({port : 8080});

let clients = new Set(); // created a set for unique values

wss.on("connection", (ws)=>{
    console.log("New client connected");
    clients.add(ws);

    //send welcome message
    ws.send(JSON.stringify({type : "welcome", msg : `welcome to the server, time currently is ${new Date()}` }));

    //when client sends something
    ws.on("message",(message)=>{
        console.log("Received : ", message.toString());
        //broadcast to everyone 
        //for of loop
        for(let client of clients){
            //don't send to sender
            if( client !== ws && client.readyState == Websockets.OPEN){ //4 states hoti hai Connecting open closing and closed
                client.send(
                    JSON.stringify({
                        type : " broadcast",
                        msg : message.toString()
                    })
                );

            }
        }
    });


    ws.on("close",()=>{
        console.log("client disconnected");
        clients.delete(ws);
    });

});

console.log("Websocket server running on ws://localhost:8080");