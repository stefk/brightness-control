var http = require('http');
var static = require('node-static');
var socketIo = require('socket.io');
var fileServer, server, io;
var brightness = 80;

fileServer = new static.Server(__dirname + '/public');

server = http.createServer(function (request, response) {
  request.addListener('end', function () {
    fileServer.serve(request, response);
  }).resume();
});

io = socketIo.listen(server);

io.sockets.on('connection', function (socket) {
  socket.emit('brightness-changed', brightness);
  socket.on('brightness-change-request', function (value) {
    console.log('Setting brightness level to %d%', value);
    io.sockets.emit('brightness-changed', brightness = value);
  });
});

server.listen(8080);

console.log('Server running at http://localhost:8080');
console.log('Initial brightness level: %d%', brightness);
