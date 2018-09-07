'use strict';

let express = require('express');

let app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


let port = process.env.PORT || 10050;

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(port, function(){
  console.log(`server running on http://localhost:${port}`);
});
