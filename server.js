var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var GPIO = require('onoff').Gpio;

// Pins
var pin = 18;

var recentValue = RCtime(pin);

function RCtime(pin) {
  var rcpin = new GPIO(pin, 'out');
  rcpin.writeSync(0);
  //rcpin.unexport();

  rcpin = new GPIO(pin, 'in');
  var start = new Date();
  while(rcpin.readSync() == 0){
    //do nothing
  }
  rcpin.unexport();
  return new Date() - start;
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('New connection ' + socket.id);
  socket.on('get', function(){
    socket.emit('reading', {value: recentValue});
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});



setInterval(function(){
  recentValue = RCtime(pin);
},400);

