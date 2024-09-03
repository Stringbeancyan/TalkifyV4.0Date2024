from flask import Flask, render_template
from flask_socketio import SocketIO, send
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///game.db'
db = SQLAlchemy(app)
socketio = SocketIO(app)

# Route for the main page
@app.route('/')
def index():
    return render_template('index.html')

# WebSocket event handler for messages
@socketio.on('message')
def handleMessage(msg):
    send(msg, broadcast=True)

# Handle game logic (example route for future extensions)
@app.route('/game')
def game():
    # Future game-related logic could go here
    return "Game endpoint"

# Error handling example
@app.errorhandler(404)
def page_not_found(e):
    return "Page not found", 404

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0')
