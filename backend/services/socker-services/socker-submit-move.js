
import { findPlayerRoom } from './socker-utility.js'

export function submitMove(moveData) {
    const playerRoom = findPlayerRoom(socket,gameList);
    io.to(playerRoom.roomName).emit('update-game', moveData, socket.id)
}