import React from "react";
import {squareToLetterNumber} from '../history.js'
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
    
    const lastMove = JSON.parse(JSON.stringify(history[historySelector -1]));
    const startingSquare = lastMove[1];
    const endingSquare = lastMove[2];
    const pieceMoved = lastMove[0];

    const lastLastMove = historySelector >= 2 ? JSON.parse(JSON.stringify(history[historySelector -2])) : null;
    const castleStatus = lastLastMove ? lastLastMove[3] : null;
    const priorStartingSquare = lastLastMove ? lastLastMove[1]: null;
    const priorEndingSquare = lastLastMove ? lastLastMove[2]: null;
    const priorPieceMoved = lastLastMove ? lastLastMove[0]: null;

    const whiteIsNext = historySelector % 2 === 0;
    const previousColor = whiteIsNext ? "black" : "white";
    const takenPieces = whiteIsNext //if whiteIsNext
        ? previousConstellation.takenWhitePieces
        : previousConstellation.takenBlackPieces;

    const takenPiece = takenPieces.find(piece => piece[1]===historySelector -1) //note this may return undefined
    if (takenPiece) takenPieces.pop();

    //handle promotion
    if (previousPosition[endingSquare].id==="promoted") {
        const promotedPawn = whiteIsNext
            ? previousConstellation.takenBlackPieces.pop()[0] //.find() guaranteed to return something since something was promoted
            : previousConstellation.takenWhitePieces.pop()[0];
        
        previousPosition[startingSquare]=promotedPawn;//undoes the prior move
        
        //next we replace taken pieces
        previousPosition[endingSquare] = takenPiece
            ? takenPiece[0]
            : {type:null};
        
        return previousConstellation;
    }

    //handle castling state

    if (castleStatus){
        if (castleStatus[previousColor]["kingside"]) {
            previousConstellation.castleStatus[previousColor]["kingside"] = true;
        }

        if (castleStatus[previousColor]["queenside"]) {
            previousConstellation.castleStatus[previousColor]["queenside"] = true;//updating state
        }
    }


    //handle castling
    const lastMoveWasCastle = pieceMoved === "king" && ((startingSquare - endingSquare) %8 %2 === 0);

    if (lastMoveWasCastle) {
        if (endingSquare - startingSquare > 0){ //kingside castle
            previousPosition[endingSquare+1] = previousPosition[endingSquare-1];
            previousPosition[endingSquare-1] = {type: null};
        } else { //queenside castle
            previousPosition[endingSquare-2] = previousPosition[endingSquare+1];
            previousPosition[endingSquare+1] = {type: null};
        }
    }

    //handle en passant state
    const lastMoveWasDouble = previousColor === "white"
        ? pieceMoved==="whitePawn"  && (startingSquare - endingSquare === 16)
        : pieceMoved==="blackPawn"  && (endingSquare - startingSquare === 16);

    
    if (lastMoveWasDouble){
        previousConstellation.enPassant={}
    }

    const lastLastMoveWasDouble = previousColor === "white"
        ?priorPieceMoved==="blackPawn"  && (priorEndingSquare - priorStartingSquare === 16)
        :priorPieceMoved==="whitePawn"  && (priorStartingSquare - priorEndingSquare === 16);

    if (lastLastMoveWasDouble){
        previousConstellation.enPassant[squareToLetterNumber(priorStartingSquare)]="true"
    }

    const enPassantWasTaken = previousColor ==="white"
        ? pieceMoved==="whitePawn"  
            && (startingSquare - 9 ===  endingSquare || startingSquare - 7 === endingSquare)
            && endingSquare - 8 === priorStartingSquare
            && endingSquare + 8 === priorEndingSquare
        : pieceMoved==="blackPawn"  
            && (startingSquare + 9 ===  endingSquare || startingSquare + 7 === endingSquare)
            && endingSquare + 8 === priorStartingSquare
            && endingSquare - 8 === priorEndingSquare;

    if (enPassantWasTaken){
        const shiftAmount = previousColor ==="white"
            ? 8
            : -8;
        previousPosition[startingSquare]=previousPosition[endingSquare];//undoes the prior move

        previousPosition[endingSquare+shiftAmount] = takenPiece[0]
        previousPosition[endingSquare] = {type: null}

        return previousConstellation
    }

    

    previousPosition[startingSquare]=previousPosition[endingSquare];//undoes the prior move

    //next we replace taken pieces
    previousPosition[endingSquare] = takenPiece
        ? takenPiece[0]
        : {type:null};

    return previousConstellation;
}