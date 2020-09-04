import React from "react";

export function Undo(props) {
    return (
        <button className="undo" onClick = {props.onClick}>
            Undo
        </button>
    )
}

export function undoLastMove(history,constellation){
    const previousConstellation = JSON.parse(JSON.stringify(constellation)); //makes a copy
    const previousPosition = constellation.position;
    const totalMoveCount = history.length;
    const lastMove = history[totalMoveCount -1];
    
    const whiteIsNext = history.length % 2 === 0;
    let lastTakenPiece;
    whiteIsNext 
    ? lastTakenPiece =constellation.takenBlackPieces.pop() 
    : lastTakenPiece =constellation.takenWhitePieces.pop(); 
    //entries lastTakenPiece will either be undefined or [{pieceobject},{turn it was taken on}]

    previousPosition[lastMove[0]]=previousPosition[lastMove[1]];
    
    lastTakenPiece[1]===totalMoveCount - 1
    ? previousPosition[lastMove[1]] = lastTakenPiece[0]
    : previousPosition[lastMove[1]] = {type: null};

    return previousConstellation
}