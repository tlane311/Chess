import { enterQueue, abandonQueue } from '../services/socker-services/socker-queue.js';  
import { submitMove } from '../services/socker-services/socker-submit-move.js';

export function sockerRoutes(socket) {
    socket.on('queue', () => enterQueue(socket));
    socket.on('abandon-queue', abandonQueue);
    socket.on('submit-move', submitMove);
    socket.on('surrender', () => {});
    socket.on('draw-request', () => {});
    socket.on('rematch-request', () => {});
    socket.on('close-room', () => {});
    socket.on('disconnect', () => {});
}