import io from 'socket.io-client';
const port = 5000;
const url = 'http://localhost:'+port;
export const socket = io(url);

export function socketIsListening() {
    socket.on('in-queue', () => {console.log('in-queue')});
    socket.on('game-created', (gameID) => {
        if (socket.id===gameID){
            console.log('white-player')
            //initialize as white player
        } else {
            console.log('black-player')
            //this.state.whiteIsNext = false;
        }
    }); //game-created needs to change in-queue message
    socket.on('update-game', async (moveData) => {
        //moveData = [type,first,second]
        console.log('update-game received')
        const selection = moveData[1];
        const nextSquare = moveData[2];
        const pieceType = moveData[0];
        console.log(selection,nextSquare)
        await this.moveHandler(selection,nextSquare,pieceType)
    });
    socket.on('opponent-surrendered', () => {});
    socket.on('welcome-user', () => {});
    socket.on('draw-request', () => {});
    socket.on('rematch-request', () => {});
    socket.on('draw-reply', () => {});
    socket.on('rematch-reply', () => {});
}

//update-game function
/*
moveData = [firstIndex,secondIndex]

moveHandler(firstIndex, secondIndex) //promotion won't work


*/