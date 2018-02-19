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

socket.on('newLocationMessage', function(data) {
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');

  a.attr('href', data.url);
  li.text(data.from + ': ');
  li.append(a);

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

const locationButton = jQuery('#send-location');
locationButton.on('click', function(e) {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  navigator.geolocation.getCurrentPosition(
    function(position) {
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      console.log(position);
    },
    function() {
      return alert('Unable to fetch location');
    },
  );
});
