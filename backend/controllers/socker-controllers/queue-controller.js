import { enterQueueService, abandonQueueService } from '../../services/socker-services/queue-service.js';

export async function enterQueue(socket,io){
    const [message, playerOne, playerTwo] = await enterQueueService(socket.id);
    //enterQueueService returns [message, randomPlayerInDB, socket.id]
    //or it returns [message, socket.id] if it can't find the other player
    console.log(message);
    if (playerTwo) {
        //a game was created we need to inform the sockets
        await socket.join(playerOne);
        await io.to(playerOne).emit('game-created', playerOne);
    } else { 
        //the first player is sitting in queue by themselves; we need to inform the socket
        await io.to(playerOne).emit('in-queue')
    }
}

export async function abandonQueue(socket,io){
    await abandonQueueService(socket.id)
    .then( () => io.to(socket.id).emit('queue-abandoned') )
    .catch( err => err)
}