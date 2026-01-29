require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: { origin: "https://wardly.netlify.app" }
});
global.io = io;

connectDB();

app.use(cors({
  origin: "https://wardly.netlify.app"
}));

app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", socket => {
  socket.on("joinWard", wardId => {
    socket.join(wardId);
    console.log("Display connected to ward:", wardId);
  });
});


app.use("/api/auth", require("./routes/auth"));
app.use("/api/patient", require("./routes/patient"));

server.listen(process.env.PORT, () => {
  console.log("Server running on", process.env.PORT);
});
