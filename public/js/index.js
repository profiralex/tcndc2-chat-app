var socket = io();
socket.on('connect', function() {
  console.log('connected to server');
});

socket.on('disconnect', function() {
  console.log('disconnected from server');
});

socket.on('newMessage', function(data) {
  console.log('New message received', data);
});

function createMessage(from, text) {
  return socket.emit('createMessage', { from: from, text: text });
}
