import { submitMoveService } from '../../services/socker-services/move-service.js';

export async function submitMove(socket,moveData,io) {
    return await submitMoveService(socket.id,moveData)
    .then( result => {
        const [message,roomName]=result;
        console.log(message);
        io.to(roomName).emit('update-game', moveData, socket.id);
    })
    .catch( err => err)
}