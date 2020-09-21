import MongoClient from 'mongodb'

const url = 'mongodb://localhost:27017';

const gameStartData = {
    history: [],
    whiteIsNext: true
}

export async function addGameToList(playerOne, playerTwo){
    return new Promise( (resolve,reject) => {
        MongoClient.connect(url, { useUnifiedTopology: true }, async (err,client) => {
            if (err) reject(err);

            const db = client.db('chess');
            await db.collection('gameList')
            .countDocuments({  
                playerOne: playerOne,
                playerTwo: playerTwo
            })
            .then( addPlayerCallback )
            .finally( () => client.close() );

            async function addPlayerCallback(result, err){
                if (err) reject(err);
                if (!result) {
                    await db.collection('gameList')
                    .insertOne({
                        room: playerOne,
                        game: JSON.parse(JSON.stringify(gameStartData)), //just making a copy
                        playerOne: playerOne,
                        playerTwo: playerTwo
                    })
                    .then( (result) => {
                        if (result.result.n===1) {
                            resolve(["Success: The game was added to the list",playerOne]);
                        } else {
                            reject(["Error: No game was created", null]);
                        }
                    });
                } else {
                    reject(['Error: This game already exists.', null]);
                }
            }
        })
    })
}

export async function removeGameFromList(playerOne, playerTwo){   
    return new Promise( (resolve,reject) => {
        MongoClient.connect(url, { useUnifiedTopology: true }, (err,client) => {
            if (err) {
                reject(err);
                client.close();
            }
            const db = client.db('chess');
            db.collection('gameList')
            .deleteOne({
                playerOne: playerOne,
                playerTwo: playerTwo
            })
            .then( (result) => {
                if (result.result.n < 1){
                    resolve("No games were removed");
                } else {
                    resolve('The game was removed');
                }
            })
            .finally( () => client.close() );
        })
    }).then(result => `Success: ${result}`)
    .catch( err => `Error: ${err}`);
}

async function doesGameExist(playerOne,playerTwo) {
    return new Promise( (resolve,reject) => {
        MongoClient.connect(url, { useUnifiedTopology: true }, async (err,client) =>{
            if (err) {
                reject(err);
                client.close();
            }
            const db = client.db('chess');
            await db.collection('gameList')
            .countDocuments({
                playerOne: playerOne,
                playerTwo: playerTwo
            })
            .then( (result, err) => {
                if (err) reject(err);
                resolve(Boolean(result));
            })
            .finally( () => client.close() );
        });
    }).then(result => `Success: ${result}`)
    .catch( err => `Error: ${err}`);
}

export async function updateGameHistory(playerOne,moveData) {
    return new Promise( (resolve,reject) => {
        MongoClient.connect(url, { useUnifiedTopology: true }, async (err,client) => {
            if (err) {
                reject(err);
                client.close();
            }
            const db = client.db('chess');
            
            //we need to know who's turn it is to update game.whiteIsNext correctly
            //this also checks the database to see if the game we are looking for exists
            const doesGameExist = await db.collection('gameList') 
            .findOne({
                $or:[
                    {playerOne: playerOne},
                    {playerTwo: playerOne}
                ]                                           
            });

            if (!doesGameExist) {
                reject('Game was not found');
                client.close();
            } else {
                await db.collection('gameList')
                .updateOne(
                    { $or: [{playerOne: playerOne}, {playerTwo: playerOne}] },
                    {
                        $set: { "game.whiteIsNext": !doesGameExist.game.whiteIsNext},
                        $push: { "game.history": moveData}
                    }
                )
                .then( (result, err) => {
                    if (err) reject(err);
                    if (result.result.n===1){
                        resolve([`Sucess: The game was updated`, doesGameExist.room]);
                    } else {
                        resolve('Error: The game was not updated');
                    }
                })
                .finally( () => client.close() );
            }
        })
    })
}

export async function finalizeGame(player,result) {
    return new Promise( (resolve,reject) => {
        MongoClient.connect(url, { useUnifiedTopology: true }, async (err,client) => {
            if (err) {
                reject(err);
                client.close();
            }
            const db = client.db('chess');

            const doesGameExist = await db.collection('gameList') 
            .findOne({
                $or:[
                    {playerOne: player},
                    {playerTwo: player}
                ]                                           
            });

            if (!doesGameExist) {
                reject('Game was not found');
                client.close();
            } else {
                await db.collection('gameList')
                .updateOne(
                    {$or: [{playerOne: player}, {playerTwo: player}]},
                    {
                        $set: { "game.resolution": result }
                    }
                )
                .then( (result, err) => {
                    if (err) reject(err);
                    if (result.result.n===1){
                        resolve([`Sucess: The game was finished`, doesGameExist.room]);
                    } else {
                        resolve('Error: The game was not updated');
                    }
                })
                .finally( () => client.close() );
            }
        });
    })
}


export async function searchListForGame(player){
    return new Promise( (resolve,reject) => {
        MongoClient.connect(url, { useUnifiedTopology: true }, async (err,client) => {
            if (err) {
                reject(err);
                client.close();
            }
            const db = client.db('chess');
            await db.collection('gameList') 
            .findOne({
                $or:[
                    {playerOne: player},
                    {playerTwo: player}
                ]                                           
            })
            .then( doc => resolve(["Success: Game found", doc.room, doc.playerOne, doc.playerTwo]))
            .catch( err => reject(["Error:", err]) )
            .finally( () => client.close() );
        });
    })
}


/* unit test
const playerOne ="Jim"
const playerTwo = "Kevin"
const result = "draw"
const result2= "white-wins"
export async function testGameListServices() {
    
    await doesGameExist(playerOne,playerTwo)
    .then( result => console.log(result), err => console.log(err)); //Success: false

    await addGameToList(playerOne, playerTwo)
    .then( result => console.log(result), err => console.log(err)); //Success: The game was added to the list
    await doesGameExist(playerOne,playerTwo)
    .then( result => console.log(result), err => console.log(err)); //Success: true

    await addGameToList(playerOne, playerTwo)
    .then( result => console.log(result), err => console.log(err)); //Success: This game already exists.
    await doesGameExist(playerOne,playerTwo)
    .then( result => console.log(result), err => console.log(err)); //Success: true

    await removeGameFromList(playerOne,playerTwo)
    .then( result => console.log(result), err => console.log(err)); //Success: The game was removed
    await doesGameExist(playerOne,playerTwo)
    .then( result => console.log(result), err => console.log(err)); //Success: false

    await removeGameFromList(playerOne,playerTwo)
    .then( result => console.log(result), err => console.log(err)); //Success: No games were removed
    await doesGameExist(playerOne,playerTwo)
    .then( result => console.log(result), err => console.log(err)); //Success: false

    await updateGameHistory(playerOne,[20,30])
    .then( result => console.log(result), err => console.log(err)); //Error: Game was not found

    await addGameToList(playerOne, playerTwo)
    .then( result => console.log(result), err => console.log(err)); //Success: The game was added to the list
    await doesGameExist(playerOne,playerTwo)
    .then( result => console.log(result), err => console.log(err)); //Success: true
    await updateGameHistory(playerTwo,[20,30])
    .then( result => console.log(result), err => console.log(err)); //Success: The game was updated
    await doesGameExist(playerOne,playerTwo)
    .then( result => console.log(result), err => console.log(err)); //Success: true
    
    await updateGameHistory(playerOne,[20,30])
    .then( result => console.log(result), err => console.log(err)); //Success: The game was updated
    await removeGameFromList(playerOne,playerTwo)
    .then( result => console.log(result), err => console.log(err)); //Success: The game was removed

    await addGameToList(playerOne, playerTwo);
    await finalizeGame(playerTwo,result);
    await finalizeGame(playerOne,result2);
}

testGameListServices()

*/
