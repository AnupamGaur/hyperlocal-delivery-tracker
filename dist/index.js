"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
const httpServer = app.listen(5000);
const wss = new ws_1.WebSocketServer({ server: httpServer });
wss.on('connection', function connection(socket) {
    socket.id = (0, uuid_1.v4)();
    socket.on('error', console.error);
    socket.on('message', function message(data) {
        try {
            const locationData = JSON.parse(data.toString());
            // Add the client ID to the location data
            const enrichedData = Object.assign(Object.assign({}, locationData), { id: socket.id });
            // Broadcast the enriched data to all clients
            wss.clients.forEach(function each(client) {
                if (client.readyState === ws_1.WebSocket.OPEN) {
                    client.send(JSON.stringify(enrichedData));
                }
            });
        }
        catch (error) {
            console.error('Error processing message:', error);
        }
    });
    // Optionally, you can handle disconnections
    socket.on('close', function close() {
        console.log(`Client ${socket.id} disconnected`);
        // You might want to broadcast this information to other clients
    });
});
