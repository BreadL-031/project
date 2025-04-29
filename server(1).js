
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Serves index.html and other files

let players = {};

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  socket.on('joinGame', (username) => {
    players[socket.id] = { username, wallet: 1000 };
    io.emit('updatePlayers', players);
  });

  socket.on('mineCrypto', (amount) => {
    if (players[socket.id]) {
      players[socket.id].wallet += amount;
      io.emit('playerUpdate', { id: socket.id, wallet: players[socket.id].wallet });
    }
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('updatePlayers', players);
    console.log('Player disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
