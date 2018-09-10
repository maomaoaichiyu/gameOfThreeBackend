'use strict';

let io = require('socket.io-client');

let socketURL = `http://0.0.0.0:${process.env.PORT || 10050}`;

var options = {
  transports: ['websocket'],
  forceNew: true,
};

describe('Game Server', function() {

  let server;
  let client1;
  let client2;
  let client3;

  let disconnectClient = (client) => {
    return new Promise((resolve) => {
      if (client && client.connected) {
        client.on('disconnect', resolve);
        client.disconnect();
      } else {
        resolve();
      }
    });
  };

  before(() => {
    server = require('../app');
  });

  after(() => {
    server.stop();
  });

  afterEach(() => {
    return disconnectClient(client1)
      .then(disconnectClient(client2))
      .then(disconnectClient(client3))
      .then(() => {
        client1 = client2 = client3 = undefined;
      });
  });

  it('Should refuse the 3rd player', function(done) {

    client1 = io.connect(socketURL, options);
    client1.on('connect', function(data){

      client2 = io.connect(socketURL, options);
      client2.on('connect', function(data){

        client3 = io.connect(socketURL, options);
        client3.on('disconnect', function() {
          done();
        });
      });
    });

  });

  it('Should notify the 3rd player that he is kicked out', function(done) {

    client1 = io.connect(socketURL, options);
    client1.on('connect', function(data){

      client2 = io.connect(socketURL, options);
      client2.on('connect', function(data){

        client3 = io.connect(socketURL, options);
        client3.on('kickout', function() {
          done();
        });
      });
    });

  });

  it('Should tell one player to start.', function(done) {

    client1 = io.connect(socketURL, options);
    client1.on('connect', function(data){

      client2 = io.connect(socketURL, options);
      client2.on('connect', function(data){
        client1.on('start', function() {
          done();
        });
        client2.on('start', function() {
          done();
        });
      });
    });

  });

});
