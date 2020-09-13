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
                            resolve("The game was added to the list");
                        } else {
                            resolve("No game was created");
                        }
                    });
                } else {
                    resolve('This game already exists.');
                }
            }
        })
    }).then(result => console.log(`Success: ${result}`))
    .catch( err => console.log(`Error: ${err}`));
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
    }).then(result => console.log(`Success: ${result}`))
    .catch( err => console.log(`Error: ${err}`));
}

export async function searchListForGame(playerOne,playerTwo){
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
    }).then(result => console.log(`Success: ${result}`))
    .catch( err => console.log(`Error: ${err}`));
}

export async function updateGameHistory(playerOne,playerTwo,moveData){
    return new Promise( (resolve,reject) => {
        MongoClient.connect(url, { useUnifiedTopology: true }, async (err,client) => {
            if (err) {
                reject(err);
                client.close();
            }
            const db = client.db('chess');



            
            const whiteJustMoved = await db.collection('gameList') //we need to know who's turn it is to update game.whiteIsNext correctly
            .findOne({                                             //this also checks the database to see if the game we are looking for exists
                playerOne: playerOne,
                playerTwo: playerTwo
            });

            if (!whiteJustMoved) {
                reject('Game was not found');
                client.close();
            } else {
                await db.collection('gameList')
                .updateOne(
                    {
                        playerOne: playerOne,
                        playerTwo: playerTwo
                    },
                    {
                        $set: { "game.whiteIsNext": !whiteJustMoved.game.whiteIsNext},
                        $push: { "game.history": moveData}
                    }
                )
                .then( (result, err) => {
                    if (err) reject(err);
                    if (result.result.n===1){
                        resolve(`The game was updated`);
                    } else {
                        resolve('The game was not updated');
                    }
                })
                .finally( () => client.close() );
            }
        })
    }).then(result => console.log(`Success: ${result}`))
    .catch( err => console.log(`Error: ${err}`));
}



/* unit test
const playerOne ="Jim"
const playerTwo = "Kevin"

export async function testGameListServices() {
    
    await searchListForGame(playerOne,playerTwo); //Success: false

    await addGameToList(playerOne, playerTwo); //Success: The game was added to the list
    await searchListForGame(playerOne,playerTwo); //Success: true

    await addGameToList(playerOne, playerTwo); //Success: This game already exists.
    await searchListForGame(playerOne,playerTwo); //Success: true

    await removeGameFromList(playerOne,playerTwo); //Success: The game was removed
    await searchListForGame(playerOne,playerTwo); //Success: false

    await removeGameFromList(playerOne,playerTwo); //Success: No games were removed
    await searchListForGame(playerOne,playerTwo); //Success: false

    await updateGameHistory(playerOne,playerTwo,[20,30]); //Error: Game was not found

    await addGameToList(playerOne, playerTwo); //Success: The game was added to the list
    await searchListForGame(playerOne,playerTwo); //Success: true
    await updateGameHistory(playerOne,playerTwo,[20,30]); //Success: The game was updated
    await searchListForGame(playerOne,playerTwo); //Success: true

    await updateGameHistory(playerOne,playerTwo,[20,30]); //Success: The game was updated
    await removeGameFromList(playerOne,playerTwo); //Success: The game was removed
}

testGameListServices()

*/
