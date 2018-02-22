const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const { Users } = require('./utils/users');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

const publicPath = path.join(__dirname, '/../public');
app.use(express.static(publicPath));

io.on('connection', socket => {
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required');
    }

    socket.join(params.room);

    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    socket.emit(
      'newMessage',
      generateMessage('Admin', 'Welcome to the chat app'),
    );

    socket
      .to(params.room)
      .broadcast.emit(
        'newMessage',
        generateMessage('Admin', `${params.name} joined conversation`),
      );

    callback();
  });

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);

    io.to(user.room).emit('updateUserList', users.getUserList(user.room));

    socket
      .to(user.room)
      .broadcast.emit(
        'newMessage',
        generateMessage('Admin', 'User left conversation'),
      );
  });

  socket.on('createMessage', (message, cb) => {
    const user = users.getUser(socket.id);

    io
      .to(user.room)
      .emit('newMessage', generateMessage(user.name, message.text));

    cb();
  });

  socket.on('createLocationMessage', (coords, cb) => {
    const user = users.getUser(socket.id);
    const locationMessage = generateLocationMessage(
      user.name,
      coords.latitude,
      coords.longitude,
    );

    io.to(user.room).emit('newLocationMessage', locationMessage);
    cb();
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
