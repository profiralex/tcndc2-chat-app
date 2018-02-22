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
  const sendMessageToAll = (topic, message) => {
    io.to(socket.user.room).emit(topic, message);
  };

  const sendMessageToOthers = (topic, message) => {
    socket.to(socket.user.room).broadcast.emit(topic, message);
  };

  const sendMessageToSocket = (topic, message) => {
    socket.emit(topic, message);
  };

  socket.on('join', (params, cb) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return cb('Name and room name are required');
    }

    const user = users.addUser(socket.id, params.name, params.room);
    socket.join(params.room);
    socket.user = user;

    sendMessageToAll('updateUserList', users.getUserList(params.room));

    sendMessageToSocket(
      'newMessage',
      generateMessage('Admin', 'Welcome to the chat app'),
    );

    sendMessageToOthers(
      'newMessage',
      generateMessage('Admin', `${params.name} joined conversation`),
    );
    cb();
  });

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);

    sendMessageToOthers('updateUserList', users.getUserList(user.room));
    sendMessageToOthers(
      'newMessage',
      generateMessage('Admin', `${user.name} left conversation`),
    );
  });

  socket.on('createMessage', (message, cb) => {
    const user = users.getUser(socket.id);

    sendMessageToAll('newMessage', generateMessage(user.name, message.text));
    cb();
  });

  socket.on('createLocationMessage', (coords, cb) => {
    const user = users.getUser(socket.id);
    const locationMessage = generateLocationMessage(
      user.name,
      coords.latitude,
      coords.longitude,
    );

    sendMessageToAll('newLocationMessage', locationMessage);
    cb();
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
