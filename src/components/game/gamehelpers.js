import { checkDetector } from './pieces/checklogic.js'

//Helpers in this file are used exclusively to mutate next: Be wary!
//next pass through, we should think about making these functional


export const stateHelper = {//this is supposed to help tidy up the extra props of state
    whitePawn: function(selection,nextSquare,nextState) {
        //add en passant status
        if (selection - nextSquare === 16){
            nextState.enPassant[nextState.position[nextSquare].id]="true";
        }
        return null;
    },
    blackPawn: function(selection,nextSquare,nextState) {
        //add en passant status
        if (selection - nextSquare=== -16){
            nextState.enPassant[nextState.position[nextSquare].id]="true";
        }
        return null;
    },
    knight: ()=>null,
    bishop: ()=>null,
    rook: function(selection,nextSquare,nextState) {
        //udpate castleStatus
        const nextPosition = nextState.position;
        const currentColor = nextPosition[nextSquare].color;
        const castleSide= nextPosition[nextSquare].id[0] ==="a" ? "queenside" : "kingside";

        //updating once and reading every time is slightly less memory intensive than updating everytime
        if (nextState.castleStatus[currentColor][castleSide]) { nextState.castleStatus[currentColor][castleSide] = false }

        return null;
    },
    queen: ()=>null,
    king: function(selection,nextSquare,nextState) {
        const nextPosition = nextState.position;
        const currentColor = nextPosition[nextSquare].color;

        //updating once and reading every time is slightly less memory intensive than updating everytime
        if (nextState.castleStatus[currentColor]["queenside"] || nextState.castleStatus[currentColor]["kingside"]) {
            nextState.castleStatus[currentColor]["queenside"] = false;
            nextState.castleStatus[currentColor]["kingside"] = false;
        }
        return null;
    }
}

function basicMoveHelper(selection, nextSquare,nextState){
    const nextPosition = nextState.position;
    nextPosition[nextSquare]=nextPosition[selection];
    nextPosition[selection]={type: null};

    return null;
}

export const moveHelper = { 
    whitePawn: function (selection, nextSquare, nextState) {
        //remove enPassant pawn first
        if ( (selection - 9 ===  nextSquare || selection - 7 === nextSquare) && !nextState.position[nextSquare].type) {
            nextState.position[nextSquare + 8] = {type: null};
        }
        //move original pawn next
        basicMoveHelper(selection, nextSquare, nextState)



        //promotion helper

    },
    blackPawn: function (selection, nextSquare, nextState) {
        //remove enPassant pawn first
        if (selection + 9 ===  nextSquare || selection + 7 === nextSquare) {
            nextState.position[nextSquare - 8] = {type: null};
        }

        //move original pawn next
        basicMoveHelper(selection, nextSquare, nextState)

        //promotion helper
        },
    knight: function (selection, nextSquare, nextState) { basicMoveHelper(selection, nextSquare, nextState) },
    bishop: function (selection, nextSquare, nextState) { basicMoveHelper(selection, nextSquare, nextState) },
    rook: function (selection, nextSquare, nextState) { basicMoveHelper(selection, nextSquare, nextState) },
    queen: function (selection, nextSquare, nextState) { basicMoveHelper(selection, nextSquare, nextState) },
    king: function (selection, nextSquare, nextState) {
        basicMoveHelper(selection, nextSquare, nextState)
        //if castling, then this will move the rook
        if (nextSquare%8 - selection%8 < -1 ) { basicMoveHelper(selection - 4, selection - 1, nextState)} //queenside
        if (nextSquare%8 - selection%8 >  1 ) { basicMoveHelper(selection + 3, selection + 1, nextState)} //kingside
    },
}


//done
export function checkHelper(nextState, whiteIsNext){ //checkHelper updates the nextState.check using checkDetector()
    const currentColor = whiteIsNext ? "white" : "black";
    const nextColor = !whiteIsNext ? "white" : "black";

    const currentInCheck = checkDetector(nextState,whiteIsNext);
    const nextInCheck = checkDetector(nextState,!whiteIsNext);

    nextState.check[currentColor]=currentInCheck;
    nextState.check[nextColor]=nextInCheck;

    return null;
}