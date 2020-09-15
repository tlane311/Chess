import { updateGameHistory } from '../../db/db-game-list.js'
//redunant function atm
export async function submitMoveService(socketID, moveData){
    return await updateGameHistory(socketID,moveData);
}