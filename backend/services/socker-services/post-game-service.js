import {removeGameFromList, finalizeGame} from '../../db/db-game-list.js'
//in the future, can add game history feature
export async function finalizeGameService(player, result) {
    return await finalizeGame(player, result);
}
export async function removeGameService(firstID, secondID){
    return await removeGameFromList(firstID,secondID);
}

export async function addGameToPlayerHistories(firstPlayer, secondPlayer){
    //need to implement
}