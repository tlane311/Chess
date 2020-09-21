import React from "react";
// UNDO AND REDO NEED TO HANDLE CASTLING AND EN PASSANT AND PROMOTION
export function Undo(props) {
    return (
        <button className="undo" onClick = {props.onClick}>
            Undo
        </button>
    )
}

export function Redo(props) {
    return (
        <button className="undo" onClick = {props.onClick}>
            Redo
        </button>
    )
}

//history is an array with elements of the form
//[piece.type, previousLocation, nextLocation]
//takenPieces is an array with elements of the form
//[piece, turnTaken]
export function undoLastMove(historySelector,history,constellation){
    const previousConstellation = JSON.parse(JSON.stringify(constellation)); //makes a copy
    const previousPosition = previousConstellation.position;
    const lastMove = history[historySelector -1];
    const whiteIsNext = historySelector % 2 === 0;

    previousPosition[lastMove[1]]=previousPosition[lastMove[2]];//undoes the prior move
    
    const takenPieces = whiteIsNext
        ? previousConstellation.takenWhitePieces
        : previousConstellation.takenBlackPieces;

    //next we replace taken pieces

    const takenPiece = takenPieces.find(piece => piece[1]===historySelector -1)
    if (takenPiece) takenPieces.pop();

    previousPosition[lastMove[2]] = takenPiece
        ? takenPiece[0]
        : {type:null};

    return previousConstellation;
}

export function redoNextMove(historySelector,history,constellation){
    const nextConstellation = JSON.parse(JSON.stringify(constellation)); //makes a copy
    const nextPosition = nextConstellation.position;
    const nextMove = history[historySelector + 1]; //this function won't run if historySelector >=history.length - 1  
    const whiteIsNext = historySelector % 2 === 0;

    const takenPieces = whiteIsNext
        ? nextConstellation.takenWhitePieces
        : nextConstellation.takenBlackPieces;
    if (nextPosition[nextMove[2]].type) takenPieces.push(nextPosition[nextMove[2]]);
    nextPosition[nextMove[2]]=nextMove[0];
    nextPosition[nextMove[1]]={type:null};
    return nextConstellation
}