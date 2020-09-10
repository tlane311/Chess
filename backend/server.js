import express from 'express';
import socket from 'socket.io';
import path from 'path';
const app = express();
const port = process.env.port || 5000;
import { pairTwoPlayers, findPlayerRoom } from './sockethelpers.js'



app.use(express.static(path.join("..", "build"))); //accesses react stuff

const server = app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
});

const io = socket(server);


let playerQueue = [];
let gameList=[];



io.on('connection', (socket) =>{
    socket.on('queue', () => {
        console.log('player has queued')
        console.log(socket.id)
        playerQueue.push(socket.id);
        playerQueue.length > 1
        ? pairTwoPlayers(socket,playerQueue,io,gameList)
        : socket.emit('in-queue');
    });
    socket.on('abandon-queue', () => {
        const playerIndex = playerQueue.indexOf(socket.id);
        playerQueue.splice(playerIndex,1);
    })
    socket.on('submit-move', (moveData) => {
        const playerRoom = findPlayerRoom(socket,gameList);
        console.log(moveData)
        console.log(playerRoom)
        
        io.to(playerRoom.roomName).emit('update-game', moveData, socket.id)
    });
    socket.on('surrender', () => {});
    socket.on('create-user', () => {});
    socket.on('draw-request', () => {});
    socket.on('rematch-request', () => {});
    socket.on('close-room', () => {});
    socket.on('disconnect', () => {});
});
