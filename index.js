const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
require("dotenv").config();
const db = require("./db");

/*const axios = require('axios');



array.forEach(function(element) {
  console.log(element);
});
*/
async function main() {

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {}
  });

  app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
  });

  app.get('/messages/:id', async (req, res) => { 
    const customer = await db.selectMessages(req.params.id);
    res.json(customer);
  })

  app.get('/messages', async (req,res) => {
    console.log('db',db);
    const messages = await db.selectMessages(undefined);
    res.json(messages)
  })

  io.on('connection', (socket) => {
    socket.on('chat message', async (msg) => {
      let result;
      try {
        // store the message in the database
        //result = await db.run('INSERT INTO messages (content) VALUES (?)', msg);
        const mensagem = await db.insertMessages(msg);

      } catch (e) {
        // TODO handle the failure
        return;
      }
      // include the offset with the message
      io.emit('chat message', msg);
    });
  });


  server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
    
  });

}
main();
