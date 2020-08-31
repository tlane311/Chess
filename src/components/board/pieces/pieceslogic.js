/*jslint es6 */
import { whitePawnLogic, blackPawnLogic } from "./pawnlogic";
import { knightLogic } from "./knightlogic";
import { bishopLogic } from "./bishoplogic";
import { rookLogic } from "./rooklogic";
import { queenLogic } from "./queenlogic";
import { kingLogic } from "./kinglogic";




/*
const checkLogic = {//filters moves during check
    rook: function(selection, state) {
        if (!state.check.white && !state.check.black) {
            return collisionLogic.rook(selection,state); //need to fix advancedPawnLogic dependency
        } else {
            const color = state.check.white ? "white" : "black";
            const newSquares=collisionLogic.rook(selection,state)
            for (let index =0; index < newSquares.length; index++) {
                let freshState = JSON.parse(JSON.stringify(state));
                freshState.position[newSquares[index]]=freshState.position[selection];
                freshState.position[selection]={type: null};
                checkDetector(freshState,true);

            }
        }
    }
}



export function checkDetector (state,whiteIsNext) {
    const color = whiteIsNext ? "black" : "white";
    const oppositeColor = color==="black" ? "white" : "black";
    const kingPosition = state.kingPosition[color];

    let check = false;

    for (let square=0; square< 64; square++) {
        if (state.position[square].type && state.position[square].color===oppositeColor){
            check = check || collisionLogic[state.position[square].type](square,state).includes(kingPosition);
        }
    }


    return check;
}

















*/


///////////////////////////
//EXPORT

export const movesLogic = {
    whitePawn: whitePawnLogic,
    blackPawn: blackPawnLogic,
    knight: knightLogic,
    bishop: bishopLogic,
    rook: rookLogic,
    queen: queenLogic,
    king: kingLogic
}

