import { pairTwoPlayers } from './socker-utility.js';

import { addPlayerToQueue, removePlayerFromQueue, isPlayerInQueue, findDifferentPlayer} from '../../db/db-player-queue';
import { addGameToList } from '../../db/db-game-list';
export async function enterQueue(socket){
        await addPlayerToQueue(socket.id)
        .catch((err) => console.log(err));
        
        await findDifferentPlayer(socket.id)
        .then( async anotherPlayer => await addGameToList(socket.id, anotherPlayer))
        .catch(socket.emit('in-queue'))
}

//this should be a controller
//below are the services called
    //talk to front-end 
    //talk to server and get playerQueue
    //call utility function


export function abandonQueue(socket){
    const playerIndex = playerQueue.indexOf(socket.id);
    playerQueue.splice(playerIndex,1);
}