import MongoClient from 'mongodb'

const url = 'mongodb://localhost:27017';

export async function addPlayerToQueue(playerID){
    return new Promise( (resolve,reject) => {
        MongoClient.connect(url, { useUnifiedTopology: true }, async (err,client) => {
            if (err) {
                reject(err);
                client.close();
            }
            const db = client.db('chess');
            db.collection('playerQueue')
            .countDocuments({  playerID: playerID  })
            .then( addPlayerCallback )
            .finally( () => client.close());

            async function addPlayerCallback(result, err){
                if (err) reject(err);
                if (!result) {
                    await db.collection('playerQueue')
                    .insertOne({  playerID: playerID  })
                    .then( (result) => {
                        if (result.result.n===1) {
                            resolve("The player was successfully added.");
                        } else {
                            reject("The player was not added.");
                        }
                    });
                } else {
                    resolve('The player was already queued.');
                }
            }
        });     
    }).then(result => console.log(`Success: ${result}`))
    .catch( err => {
        console.log(`Error: ${err}`);
        return `Error: ${err}`;
    });
}

export async function removePlayerFromQueue(playerID) {
    return new Promise( (resolve, reject) => {
            MongoClient.connect(url, { useUnifiedTopology: true }, (err,client) => {
                if (err) {
                    reject(err);
                    client.close();
                }
                const db = client.db('chess');        
                db.collection('playerQueue')
                .deleteOne({  playerID: playerID  })
                .then( (result) => {
                    if (result.result.n < 1){
                        resolve("No players were found");
                    } else {
                        resolve('the player was removed');
                    }
                })
                .finally( () => client.close() );
            })
    }).then(result => console.log(`Success: ${result}`))
    .catch( err => console.log(`Error: ${err}`));
}

export async function isPlayerInQueue(playerID) {
    return new Promise( (resolve, reject) => {
        MongoClient.connect(url, { useUnifiedTopology: true }, async (err,client) =>{
            if (err) {
                reject(err);
                client.close();
            }
            const db = client.db('chess');
            await db.collection('playerQueue')
            .countDocuments({  playerID: playerID  })
            .then( (result, err) => {
                if (err) reject(err);
                resolve(Boolean(result));
            })
            .finally( () => client.close() );
            
        });
    }).then(result => console.log(`Success: ${result}`))
    .catch( err => console.log(`Error: ${err}`));
}

export async function findDifferentPlayer(playerID){
    //if a player is found, resolve returns the other playerID
    //if no player is found, reject returns null
    return new Promise( (resolve, reject) => {
        MongoClient.connect(url, { useUnifiedTopology: true }, async (err,client) =>{
            if (err) {
                reject(err);
                client.close();
            }
            const db = client.db('chess');
            await db.collection('playerQueue')
            .findOne({
                playerID: {$ne: playerID}
            })
            .then( (result) => {
                if (result) resolve(result.playerID);
                reject(null);
            })
            .catch( err => reject(err))
            .finally( () => client.close())
        })
    })
}




//Below is a test
/*
const playerID="user1"
const anotherID="user2";
export async function testQueueServices() {
    await isPlayerInQueue(playerID); // Success: false
    
    await addPlayerToQueue(playerID); // Success: The player was successfully added.
    await isPlayerInQueue(playerID); // Success: true
    
    await addPlayerToQueue(playerID); // Success: The player was already queued.
    await isPlayerInQueue(playerID); // Success: true

    await removePlayerFromQueue(playerID); // Success: the player was removed
    await isPlayerInQueue(playerID); // Success: false

    await removePlayerFromQueue(playerID); // Success: No players were found
    await isPlayerInQueue(playerID); // Success: false

    await addPlayerToQueue(playerID);
    await addPlayerToQueue(anotherID);
    await findDifferentPlayer(playerID).then(result => console.log(result)).catch( err => console.log(err));
    await removePlayerFromQueue(anotherID);
}

testQueueServices();
*/


