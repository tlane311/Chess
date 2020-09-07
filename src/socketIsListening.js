import openSocket from 'socket.io-client'
const socket = openSocket('http://localhost:5000');

export default function socketIsListening() {
    socket.on('game-created', () => {});
    socket.on('update', () => {});
    socket.on('opponent-surrendered', () => {});
    socket.on('welcome-user', () => {});
    socket.on('draw-request', () => {});
    socket.on('rematch-request', () => {});
    socket.on('draw-reply', () => {});
    socket.on('rematch-reply', () => {});
}
