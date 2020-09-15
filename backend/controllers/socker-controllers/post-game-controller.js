import { finalizeGameService, removeGameService } from '../../services/socker-services/post-game-service.js';
import {addGameToList, searchListForGame} from '../../db/db-game-list.js'

export async function finishGame(socket,finishMessage,socketColor,io) {
    const gameResult = finishMessage==='draw'
    ? finishMessage
    : socketColor+'-wins';
    return await finalizeGameService(socket.id,gameResult)
    .then( result => {
        const [message,roomName]=result;
        console.log(message);
        io.to(roomName).emit('finish-game',  gameResult);
    })
    .catch( err => err)
}


export async function startRematch(socket, io){
    try {
        //await addGameToPlayerHistories(firstPlayer, secondPlayer)
        const [message,roomName,whitePlayer,blackPlayer] = await searchListForGame(socket.id);
        console.log(message)
        await removeGameService(whitePlayer, blackPlayer);
        await addGameToList(blackPlayer,whitePlayer);
        await io.to(roomName).emit('game-created', roomName);
    } catch(e) {
        throw(e);
    }
}

export async function closeRoom(firstPlayer, secondPlayer,io){
    const firstID = firstPlayer[0];
    const secondID = secondPlayer[0];
    try{
        //await addGameToPlayerHistories(firstPlayer, secondPlayer)
        await removeGameService(firstID, secondID);
        await io.to(firstID).emit('room-closed', secondID);
        //in frontend, firstID will leave the room secondID
    } catch(e){
        throw(e);
    }
}

export async function requestDraw(socket, io){
    try {
        const [message,roomName] = await searchListForGame(socket.id);
        console.log(message);
        console.log("requesting draw")
        await io.to(roomName).emit('draw-requested', socket.id)
    } catch(e) {
        throw(e);
    }
}

export async function drawDeclined(socket,io){
    try {
        const [message,roomName] = await searchListForGame(socket.id);
        console.log(message);
        console.log("draw declined");
        await io.to(roomName).emit('draw-declined', socket.id);
    } catch(e) {
        throw(e);
    }
}

export async function requestRematch(socket,io){
    try {
        const [message,roomName] = await searchListForGame(socket.id);
        console.log(message);
        console.log("requesting rematch");
        await io.to(roomName).emit('rematch-requested', socket.id);
    } catch(e) {
        throw(e);
    }
}

export async function rematchDeclined(socket,io){
    try {
        const [message,roomName,whitePlayer,blackPlayer] = await searchListForGame(socket.id);
        console.log(message);
        console.log("rematchdeclined");
        await io.to(roomName).emit('rematch-declined', socket.id);
        await closeRoom(whitePlayer,blackPlayer,io);
    } catch(e) {
        throw(e);
    }
}