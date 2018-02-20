Vue.component('message-item', {
  props: ['message'],
  template:
    '\
    <li class="message">\
    <div class="message__title">\
      <h4>{{ message.from }}</h4>\
      <span>{{ message.formattedTime }}</span>\
    </div>\
    <div class="message__body">\
      <p v-if="message.url">\
        <a v-if="message.url" target="_blank" :href="message.url">My current location</a>\
      </p>\
      <p v-if="!message.url"> {{ message.text }} </p>\
    </div>\
    </li>',
});

var app = new Vue({
  el: '#app',
  data: {
    messages: [],
    playSound: false,
    connected: false,
    messageButton: {
      text: 'Send',
      enabled: true,
    },
    locationButton: {
      text: 'Send location',
      enabled: true,
    },
    newMessageText: '',
    username: 'User',
    socket: io(),
  },

  mounted: function() {
    var ref = this;
    ref.socket.on('connect', function() {
      console.log('connected to server');
      ref.connected = true;
    });

    ref.socket.on('disconnect', function() {
      console.log('disconnected from server');
      ref.connected = true;
    });

    ref.socket.on('newMessage', function(data) {
      data.formattedTime = moment(data.createdAt).format('h:mm a');
      ref.addMessage(data);
    });

    ref.socket.on('newLocationMessage', function(data) {
      data.formattedTime = moment(data.createdAt).format('h:mm a');
      ref.addMessage(data);
    });
  },

  methods: {
    addMessage: function(message) {
      this.messages.push(message);

      var clientHeight = this.$refs.messages.clientHeight;
      var scrollTop = this.$refs.messages.scrollTop;
      var scrollHeight = this.$refs.messages.scrollHeight;
      var currentHeight = scrollTop + clientHeight;

      if (clientHeight === scrollHeight || currentHeight === scrollHeight) {
        this.$nextTick(function() {
          this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
        });
      }
    },
    sendMessage: function() {
      var ref = this;
      if (!this.newMessageText) {
        return;
      }

      var data = { from: this.username, text: this.newMessageText };

      this.messageButton.enabled = false;

      this.socket.emit('createMessage', data, function(response) {
        ref.newMessageText = '';
        ref.messageButton.enabled = true;
      });
    },

    sendLocation: function() {
      var ref = this;
      if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
      }

      this.locationButton.text = 'Sending location...';
      this.locationButton.enabled = false;

      navigator.geolocation.getCurrentPosition(
        function(position) {
          ref.socket.emit(
            'createLocationMessage',
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            function() {
              ref.locationButton.text = 'Send location...';
              ref.locationButton.enabled = true;
            },
          );
        },
        function() {
          ref.locationButton.text = 'Send location...';
          ref.locationButton.enabled = true;
          return alert('Unable to fetch location');
        },
      );
    },
  },
});
