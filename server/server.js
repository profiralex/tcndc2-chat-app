const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const publicPath = path.join(__dirname, '/../public');
app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('New user connected');
  socket.on('disconnect', socket => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
