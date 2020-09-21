import io from 'socket.io-client';
import { firstPosition } from './components/game/pieces/pieces';
const port = 5000;
const url = 'http://localhost:'+port;
export const socket = io(url,{autoConnect: false});

export function socketIsListening() {
    socket.on('in-queue', () => {console.log('in-queue')});
    socket.on('game-created', (gameID) => {
        socket.emit('room-change-request')
        if (socket.id===gameID){
            console.log('white-player')
            this.setState({
                gameType: "online",
                playerColorIsWhite: true,
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
        const prettyResult = gameResult.split("-")
        .map( substring => substring[0].toUpperCase() + substring.slice(1))
        .join(" ") 
        + "!";
        this.setState({
            gameResult: prettyResult,
            postGame: true,
        })
    });

    socket.on('client-rematch-accepted', (roomName) => {
        this.setState({
            postGame: false
        })
        console.log('accepted-rematch');
    });
    socket.on('client-rematch-declined', ()=>{
        this.setState({
            gameType: "local"
        })
        console.log('declined-rematch')
    });
    socket.on('room-closed', ()=>{
        this.setState({
            otherPlayerHasLeft: true,
        })
    });
    socket.on('welcome-user', () => {});
}

export async function menuIsListening(){
    socket.on('game-created', (playerOne) => {
        const playerIsLight = socket.id===playerOne;
        this.setState({
            inGame: true,
            playerIsLight: playerIsLight
        })
    });
    socket.on('finish-game', (gameResult) => {
        this.setState({
            inGame: false,
            playerIsLight: null
        })
    });
    
    socket.on('draw-requested', (requesterID) => {
        if (requesterID !==socket.id){
            this.setState({
                drawRequested: true,
                inGameShown: true
            })
        }
    } )

    socket.on('draw-declined', (decliningID) => {
        if (decliningID !== socket.id){
            this.setState({
                sentDrawRequest: false,
                drawDeclined: true
            })
        } else {
            this.setState({
                sentDrawRequest: false,
                drawDeclined: true
            })
        }
    })

    socket.on('update-game', () => {
        this.setState({
            drawRequested: false,
            drawRequestSent: false,
            drawDeclined: false,
        })
    })
}


export async function postGameIsListening(){
    socket.on('rematch-requested', (playerID) => {
        if (socket.id!==playerID){
            this.setState({
                rematchRequested: true,
            })
        } else {
            this.setState({
                requestSent: true,
            })
        }
    });
    socket.on('client-rematch-declined', ()=>{
        this.setState({
            rematchDeclined: true,
            rematchRequested: false,
        })
    });
    socket.on('room-closed', ()=>{
        this.setState({
            otherPlayerHasLeft: true,
        })
    });
}