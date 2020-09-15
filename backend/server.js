import express from 'express';
import socket from 'socket.io';
import path from 'path';
const app = express();
const port = process.env.port || 5000;
import { sockerRoutes } from './routes/socker-routes.js'


app.use(express.static(path.join("..", "build"))); //accesses react stuff

const server = app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
});

const io = socket(server);


let playerQueue = [];
let gameList=[];



io.on('connection', (socket) => sockerRoutes(socket,io));
