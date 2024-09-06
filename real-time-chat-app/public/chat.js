let socket;
let username;

document.getElementById('join-btn').addEventListener('click', function () {
    username = document.getElementById('username').value;
    if (username) {
        socket = new WebSocket('ws://localhost:3000');

        socket.onopen = function () {
            socket.send(JSON.stringify({ type: 'setUsername', username }));
            document.getElementById('message-input').disabled = false;
            document.getElementById('send-btn').disabled = false;
        };

        socket.onmessage = function (event) {
            const data = JSON.parse(event.data);
            if (data.type === 'chatMessage') {
                displayMessage(`${data.username}: ${data.message}`);
            } else if (data.type === 'userJoined') {
                displayMessage(`${data.username} joined the chat. Current users: ${data.users.join(', ')}`);
            } else if (data.type === 'userLeft') {
                displayMessage(`${data.username} left the chat. Current users: ${data.users.join(', ')}`);
            }
        };

        socket.onclose = function () {
            displayMessage('Connection closed.');
        };
    } else {
        alert('Please enter a username');
    }
});

document.getElementById('send-btn').addEventListener('click', function () {
    const message = document.getElementById('message-input').value;
    if (message) {
        socket.send(JSON.stringify({ type: 'sendMessage', message }));
        document.getElementById('message-input').value = '';
    }
});

function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    document.getElementById('messages').appendChild(messageElement);
}