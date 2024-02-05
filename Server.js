const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
require("dotenv").config();
const db = require("./db");

server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

let messages = [];


io.on('connection', (socket) => {
  console.log('Usuário conectado');

 

  socket.on('disconnect', () => {
    console.log('Usuário desconectado');
  });

  socket.on('chat message', (data) => {
    console.log(`Mensagem recebida: ${data}`);
    io.emit('chat message', data);
    
    /*Aqui voces pegam a mensagem*/ 
    const msg = db.insertMessages(data);

  });
  
});
  
