'use strict';

let port = process.env.PORT || 10050;
let io = require('socket.io').listen(port);

let numberOfPlayers = 0;

io.on('connection', function(socket){

  if ((numberOfPlayers + 1) > 2) {
    socket.emit('kickout');
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
    io.clients((error, clients) => {
      if (error) throw error;
      let startingPlayerId = clients[Math.round(Math.random())];
      console.log(`User ${startingPlayerId} starts.`);
      io.to(startingPlayerId).emit('start');
    });
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

module.exports.stop = () => {
  io.close();
};
