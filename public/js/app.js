// const express = require('express');
// const socketio = require('socket.io');
// const http = require('http');
// const dotenv        =  require('dotenv');
// dotenv.config({path:'process.env'});
// const PORT = (process.env.PORT || 3000);

// const app = express();
// const server = http.createServer(app);
// const io = socketio(server);

// io.on('connection', (socket) => {
//     console.log('New user connected');

//     socket.on('sendMessage', (message) => {
//         io.emit('message', message);
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
// });

// server.listen(PORT, () => {
//     console.log('Server listening on port 3000');
// });