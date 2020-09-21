import { finalizeGameService, removeGameService } from '../../services/socker-services/post-game-service.js';
import {addGameToList, searchListForGame} from '../../db/db-game-list.js'

export async function finishGame(socket,finishMessage,socketColor,io) {
    const opposingColor = socketColor === "white"? "black": "white";
    
    const gameResult = finishMessage==='draw'
    ? finishMessage
    : opposingColor+'-wins';
    return await finalizeGameService(socket.id,gameResult)
    .then( result => {
        const [message,roomName]=result;
        console.log(message);
        io.to(roomName).emit('finish-game',  gameResult);
    })
    .catch( err => err)
}

export async function requestDraw(socket, io){
    try {
        const [message,roomName] = await searchListForGame(socket.id);
        console.log(message);
        console.log("requesting draw")
        await io.to(roomName).emit('draw-requested', socket.id)
    } catch(e) {
        console.log(e);
    }
}

export async function drawDeclined(socket,io){
    try {
        const [message,roomName] = await searchListForGame(socket.id);
        console.log(message);
        console.log("draw declined");
        await io.to(roomName).emit('draw-declined', socket.id);
    } catch(e) {
        console.log(e);
    }
}

export async function requestRematch(socket,io){
    try {
        const [message,roomName] = await searchListForGame(socket.id);
        console.log(message);
        console.log("requesting rematch");
        await io.to(roomName).emit('rematch-requested', socket.id);
    } catch(e) {
        console.log(e);
    }
}

export async function startRematch(socket, io){
    try {
        //await addGameToPlayerHistories(firstPlayer, secondPlayer)
        const [message,roomName,whitePlayer,blackPlayer] = await searchListForGame(socket.id);
        console.log(message)
        await removeGameService(whitePlayer, blackPlayer);
        const [gameCreationMessage, newRoomName] = await addGameToList(blackPlayer,whitePlayer);
        console.log(gameCreationMessage)
        await io.to(roomName).emit('client-rematch-accepted', roomName);
        await io.to(roomName).emit('game-created', newRoomName);
    } catch(e) {
        console.log(e);
    }
}

export async function rematchDeclined(socket,io){
    try {
        const [message,roomName] = await searchListForGame(socket.id);
        console.log(message);
        console.log("rematch-declined");
        await io.to(roomName).emit('client-rematch-declined', socket.id);
        await closeRoom(socket,io);
    } catch(e) {
        console.log(e);
    }
}



//ROOM SERVICES
export async function closeRoom(socket, io){
    try{
        const [message,roomName, whitePlayer, blackPlayer] = await searchListForGame(socket.id);
        //await addGameToPlayerHistories(firstPlayer, secondPlayer)
        await removeGameService(whitePlayer, blackPlayer);
        if (socket.id!==roomName) socket.leave(roomName);
        await io.to(whitePlayer).emit('room-closed');
        await io.to(blackPlayer).emit('room-closed')
    } catch(e){
        console.log(e);
    }
}

export async function changeRooms(socket, io){
    try {    
        const [message,roomName,whitePlayer,blackPlayer] = await searchListForGame(socket.id);
        console.log('attempting to switch rooms');
        console.log(message);
        if (socket.id===whitePlayer) socket.leave(blackPlayer);
        if (socket.id===blackPlayer) socket.join(roomName);
    } catch(e){
        console.log(e);
    }
}