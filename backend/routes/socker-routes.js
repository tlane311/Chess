import { enterQueue, abandonQueue } from '../controllers/socker-controllers/queue-controller.js';  
import { submitMove } from '../controllers/socker-controllers/move-controller.js'
import { finishGame, startRematch, closeRoom, requestDraw, requestRematch, rematchDeclined } from '../controllers/socker-controllers/post-game-controller.js';


export function sockerRoutes(socket,io) {
    socket.on('queue',  () => enterQueue(socket,io));
    socket.on('abandon-queue', () => abandonQueue(socket,io) );
    socket.on('submit-move', moveData => submitMove(socket,moveData,io) );
    socket.on('checkmate', socketColor => finishGame(socket, "checkmate", socketColor, io) );
    socket.on('surrender', socketColor => finishGame(socket,'surrender', socketColor, io) );
    socket.on('draw', socketColor => finishGame(socket,'draw', socketColor, io) );
    socket.on('draw-request', () => requestDraw(socket,io) ); 
    socket.on('draw-declined', () => {});
    socket.on('rematch-request', () => requestRematch(socket,io) );
    socket.on('rematch-accepted', () => startRematch(socket,io));
    socket.on('rematch-declined', () => rematchDeclined(socket,io));//no db stuff
    socket.on('close-room', (firstPlayer,secondPlayer) => closeRoom(firstPlayer,secondPlayer,io)); 
    socket.on('disconnect', () => {}); //no db stuff
}