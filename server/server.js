const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const publicPath = path.join(__dirname, '/../public');
app.use(express.static(publicPath));

io.on('connection', socket => {
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required');
    }

    socket.join(params.room);
    socket.name = params.name;
    socket.room = params.room;

    socket.emit(
      'newMessage',
      generateMessage('Admin', 'Welcome to the chat app'),
    );

    socket
      .to(socket.room)
      .broadcast.emit(
        'newMessage',
        generateMessage('Admin', `${socket.name} joined conversation`),
      );

    callback();
  });

  socket.on('disconnect', () => {
    socket
      .to(socket.room)
      .broadcast.emit(
        'newMessage',
        generateMessage('Admin', 'User left conversation'),
      );
  });

  socket.on('createMessage', (message, cb) => {
    io
      .to(socket.room)
      .emit('newMessage', generateMessage(socket.name, message.text));
    cb();
  });

  socket.on('createLocationMessage', (coords, cb) => {
    const locationMessage = generateLocationMessage(
      socket.name,
      coords.latitude,
      coords.longitude,
    );
    io.to(socket.room).emit('newLocationMessage', locationMessage);
    cb();
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
