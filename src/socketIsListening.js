import io from 'socket.io-client';
import { firstPosition } from './components/game/pieces/pieces';
const port = 5000;
const url = 'http://localhost:'+port;
export const socket = io(url,{autoConnect: false});

export function socketIsListening() {
    socket.on('in-queue', () => {console.log('in-queue')});
    socket.on('game-created', (gameID) => {
        if (socket.id===gameID){
            console.log('white-player')
            this.setState({
                gameType: "online",
                constellation: firstPosition,
                history: [],
                selected: null,
                whiteIsNext: true,
                promotionStatus: false,
                promotionLocation: null  
            })
        } else {
            console.log('black-player')
            this.setState({
                gameType: "online",
                playerColorIsWhite: false,
                constellation: firstPosition,
                history: [],
                selected: null,
                whiteIsNext: true,
                promotionStatus: false,
                promotionLocation: null  
            })
        }
    }); //game-created needs to change in-queue message
    socket.on('update-game', async (moveData, socketID) => {
        //moveData = [type,first,second]
        if (socketID !== socket.id){
            const selection = moveData[1];
            const nextSquare = moveData[2];
            const pieceType = moveData[0];
            await this.moveHandler(selection,nextSquare,pieceType)
        }
    });
    socket.on('finish-game', (gameResult) => {
        this.setState({
            gameResult: gameResult,
            postGame: true,
        })
    });
    socket.on('draw-requested', (playerID) => {

    });
    socket.on('draw-declined', (playerID) => {
        
    });
    socket.on('rematch-requested', (playerID) => {

    });
    socket.on('rematch-declined', (playerID)=>{
        
    });
    socket.on('room-closed', () => {});
    socket.on('welcome-user', () => {});
}

export async function menuIsListening(){
    socket.on('game-created', (playerOne) => {
        const playerIsLight= socket.id===playerOne;
        this.setState({
            inGame: true,
            playerIsLight: playerIsLight
        })
    })
}


export async function postGameIsListening(){
    socket.on('rematch-request', ()=> {

    });
}