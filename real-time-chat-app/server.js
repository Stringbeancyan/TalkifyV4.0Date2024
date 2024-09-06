const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let users = [];

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const msgData = JSON.parse(message);

        if (msgData.type === 'setUsername') {
            ws.username = msgData.username;
            users.push(ws.username);
            broadcast({ type: 'userJoined', username: ws.username, users });
        } else if (msgData.type === 'sendMessage') {
            broadcast({ type: 'chatMessage', username: ws.username, message: msgData.message });
        }
    });

    ws.on('close', () => {
        users = users.filter((username) => username !== ws.username);
        broadcast({ type: 'userLeft', username: ws.username, users });
    });
});

function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

app.use(express.static(path.join(__dirname, 'public')));

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});