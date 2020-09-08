export function findPlayerRoom(socket, gameList){
    const socketId = socket.id;
    const roomIndex = gameList.findIndex( gameData => gameData.playerOne===socketId || gameData.playerTwo===socketId);
    return roomIndex < 0
    ? null
    : {
        roomName: gameList[roomIndex].room,
        roomIndex: roomIndex
    };
}



const gameStartData={
    constellation: null,
    history: [],
    whiteIsNext: true
}

//playerQueue is a global variable in server
//playerQueue is a list of player ids
export async function pairTwoPlayers(socket,playerQueue,io,gameList){
    const playerOne=playerQueue.shift();
    const playerTwo=playerQueue.shift();
    await socket.join(playerOne);
    await io.to(playerOne).emit('game-created');
    const individualGameData = {
        room: playerOne,
        game: JSON.parse(JSON.stringify(gameStartData)),
        playerOne: playerOne,
        playerTwo: playerTwo
    }
    gameList.push(individualGameData);
    console.log(`a new game has been created`);

    return null;
}