import io from 'socket.io-client';
const port = 5000;
const url = 'http://localhost:'+port;
export const socket = io(url);

export function socketIsListening() {
    socket.on('in-queue', () => {console.log('in-queue')});
    socket.on('game-created', () => {}); //game-created needs to change in-queue message
    socket.on('update-game', () => {});
    socket.on('opponent-surrendered', () => {});
    socket.on('welcome-user', () => {});
    socket.on('draw-request', () => {});
    socket.on('rematch-request', () => {});
    socket.on('draw-reply', () => {});
    socket.on('rematch-reply', () => {});
}

//update-game function
/*
moveData = [firstIndex,secondIndex]

moveHandler(firstIndex, secondIndex) //promotion won't work


*/