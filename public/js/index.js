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

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  var messageTextbox = jQuery('[name=message]');
  var message = messageTextbox.val();

  if (!message) {
    return;
  }

  var data = { from: 'User', text: message };

  socket.emit('createMessage', data, function(response) {
    messageTextbox.val('');
  });
});

const locationButton = jQuery('#send-location');
locationButton.on('click', function(e) {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  locationButton.text('Sending location...').attr('disabled', true);

  navigator.geolocation.getCurrentPosition(
    function(position) {
      socket.emit(
        'createLocationMessage',
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        function() {
          locationButton.text('Send location').removeAttr('disabled');
        },
      );
    },
    function() {
      locationButton.text('Send location').removeAttr('disabled');
      return alert('Unable to fetch location');
    },
  );
});
