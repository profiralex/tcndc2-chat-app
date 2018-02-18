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
  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the chat app',
    createdAt: new Date().getTime(),
  });

  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New user joined conversation',
    createdAt: new Date().getTime(),
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('newMessage', {
      from: 'Admin',
      text: 'User left conversation',
      createdAt: new Date().getTime(),
    });
  });

  socket.on('createMessage', message => {
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime(),
    });
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
