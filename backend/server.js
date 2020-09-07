const express = require('express');
const socket = require('socket.io');
const path = require('path');
const app = express();
const port = process.env.port || 5000;

app.use(express.static(path.join(__dirname, "..", "build"))); //accesses react stuff


const server = app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
});

const io = socket(server);

io.on('connection', (socket) =>{
    socket.on('queue', () => {});
    socket.on('submit-move', () => {});
    socket.on('surrender', () => {});
    socket.on('create-user', () => {});
    socket.on('draw-request', () => {});
    socket.on('rematch-request', () => {});
    socket.on('close-room', () => {});
    socket.on('disconnect', () => {});
});
