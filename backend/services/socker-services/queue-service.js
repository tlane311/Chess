import { addPlayerToQueue, removePlayerFromQueue, findDifferentPlayer} from '../../db/db-player-queue.js';
import { addGameToList } from '../../db/db-game-list.js';


/*
enterQueueService returns the playerIDs that were used to make the game (if a game was made)
*/

export async function enterQueueService(socketID){
        return await addPlayerToQueue(socketID)
        .then( () =>  findDifferentPlayer(socketID))
        .then( 
            async anotherPlayer => {
            await addGameToList(anotherPlayer, socketID);
            return [anotherPlayer, socketID]; //change this to resolve
            },
            (err) => { throw([err,socketID]) }
        )
        .then( async result => {
            let firstPlayer, secondPlayer
            [firstPlayer, secondPlayer]= [...result] 
            await removePlayerFromQueue(firstPlayer)
            .then( () => removePlayerFromQueue(secondPlayer) );
            return ['Success: A game was created', firstPlayer,secondPlayer];
        })
        .catch(err => {
            return err})
}

export async function abandonQueueService(socketID){
    return await removePlayerFromQueue(socketID)
    .catch( err => err)
}

/* test
const socketID="user123";
const anotherID="secondUser321"
const aThirdID="thirduser420"

async function testQueueServices(){
    await enterQueueService(socketID).then( result => console.log(result), result => console.log(result)); //Success: The player was successfully added.
                                //[ 'Error: Unable to find match', 'user123' ]
    await enterQueueService(anotherID).then( result => console.log(result),result => console.log(result));//Success: The player was successfully added.
                                //Success: The game was added to the list
                                //Success: the player was removed
                                //Success: the player was removed
    await enterQueueService(aThirdID).then( result => console.log(result), result => console.log(result)); //Success: The player was successfully added.
                                //[ 'Error: Unable to find match', 'thirduser420' ]
    await abandonQueueService(aThirdID).then( result => console.log(result),result => console.log(result)); //Success: the player was removed
    await abandonQueueService(socketID).then( result => console.log(result),result => console.log(result)); //Success: No players were found
}

testQueueServices()
*/
