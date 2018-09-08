'use strict';

let express = require('express');

let app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


let port = process.env.PORT || 10050;

let numberOfPlayers = 0;

io.on('connection', function(socket){

  if ((numberOfPlayers + 1) > 2) {
    socket.disconnect(true);
    console.log(`User ${socket.id} refused`);
    return;
  }

  numberOfPlayers += 1;
  console.log(`User ${socket.id} connected`);
  socket.on('disconnect', function(){
    numberOfPlayers -= 1;
    console.log(`User ${socket.id} disconnected`);
  });
  if (numberOfPlayers === 2) {
    socket.emit('start');
  }

  socket.on('number', function(number) {
    console.log(`received ${number} from ${socket.id}`);
    if (number === 1) {
      socket.emit('game-over', { win: true });
      socket.broadcast.emit('game-over', { win: false });
    } else {
      socket.broadcast.emit('number', number);
    }
  });

});

http.listen(port, function(){
  console.log(`server running on http://localhost:${port}`);
});
