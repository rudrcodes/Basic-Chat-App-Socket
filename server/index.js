import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

//we pass httpserver into this to connect our socket.io server with express server
const io = new Server(httpServer, {
  /* options */
  //It is necessary to pass the url of the frontend that will make calls to the socket server
  cors: {
    // Connecting backend to front

    origin: "https://rudransh-socket-chat-app.netlify.app",
    // origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// app.get("/", (req, res) => {
//   res.send("Hello World"); //sending response back
// });

//every thing should be done only when you are connected
io.on("connection", (socket) => {
  console.log(`user Connected : ${socket.id}`);

  //* join_room is the event and when that event is emitted from the client then this will be called
  socket.on("join_room", ({ username, roomID }) => {
    socket.join(roomID);
    //to check
    console.log(
      `User ${username} with id : ${socket.id} joined room : ${roomID}`
    );
  });

  socket.on("send_message", (messageData) => {
    //Whenever someones send a message we want that to be broadcasted to all the users for that we will emit an event inside it
    //*broadcast sends that message to everyone irrespective of the roomID
    // socket.broadcast.emit("recieve_message", messageData);

    //*to send to the users who are in a particular room only
    socket.to(messageData.roomID).emit("recieve_message", messageData);
    // console.log(messageData);
  });
  socket.on("disconnect", () => {
    console.log(`user disconnected : ${socket.id}`);
  });
});

io.listen(5137);

// ! FROM THE DOCS - Using app.listen(3000) will not work here, as it creates a new HTTP server.

httpServer.listen(3001, () => {
  console.log("Server is running at port 3001 ..✅");
});
