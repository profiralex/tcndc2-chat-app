const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const publicPath = path.join(__dirname, '/../public');
app.use(express.static(publicPath));

io.on('connection', socket => {
  socket.emit(
    'newMessage',
    generateMessage('Admin', 'Welcome to the chat app'),
  );

  socket.broadcast.emit(
    'newMessage',
    generateMessage('Admin', 'New user joined conversation'),
  );

  socket.on('disconnect', () => {
    socket.broadcast.emit(
      'newMessage',
      generateMessage('Admin', 'User left conversation'),
    );
  });

  socket.on('createMessage', (message, cb) => {
    io.emit('newMessage', generateMessage(message.from, message.text));
    cb({ status: 'success' });
  });

  socket.on('createLocationMessage', coords => {
    const locationMessage = generateLocationMessage(
      'Admin',
      coords.latitude,
      coords.longitude,
    );
    io.emit('newLocationMessage', locationMessage);
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
