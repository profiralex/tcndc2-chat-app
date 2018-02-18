var socket = io();
socket.on('connect', function() {
  console.log('connected to server');
});

socket.on('disconnect', function() {
  console.log('disconnected from server');
});

socket.on('newMessage', function(data) {
  var li = jQuery('<li></li>');
  li.text(data.from + ': ' + data.text);
  jQuery('#messages').append(li);
});

function createMessage(from, text) {
  var data = { from: from, text: text };
  return socket.emit('createMessage', data, function(response) {
    console.log('Message sent');
  });
}

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  var message = jQuery('[name=message]').val();
  createMessage('User', message);
});
