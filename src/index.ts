import express from 'express'
import { WebSocketServer,WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const app = express()
const httpServer = app.listen(5000)

interface ExtendedWebSocket extends WebSocket {
  id: string;
}

const wss = new WebSocketServer({server:httpServer})
wss.on('connection', function connection(socket: ExtendedWebSocket){
  socket.id = uuidv4();
  socket.on('error',console.error);

  socket.on('message', function message(data) {
    try {
      const locationData = JSON.parse(data.toString());
      
      const enrichedData = {
        ...locationData,
        id: socket.id
      };

      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(enrichedData));
        }
      });
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  socket.on('close', function close() {
    console.log(`Client ${socket.id} disconnected`);
  });
})

