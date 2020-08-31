import { movesLogic } from "./pieceslogic"

export function checkDetector (state,whiteIsNext) {
    const color = !whiteIsNext ? "white" : "black";
    const kingPosition = state.kingPosition[color]; //gives a number in position array
    const position = state.position;


    let checkCallBack = (square, index) => {
        return square.type && square.color !== color
        ? movesLogic[square.type](index,state)
        .filter( number => number === kingPosition)
        .length
        : false;
    }

    const check = position.some( checkCallBack );

    return check;
}

export function checkFilter (unfilteredMoves, selection,state,whiteIsNext){
    return unfilteredMoves.filter( (square) => {
        let nextState = JSON.parse(JSON.stringify(state));
        let nextPosition = nextState.position;
        nextPosition[square] = nextPosition[selection];
        nextPosition[selection] = {type: null};
        return !checkDetector(nextState,!whiteIsNext)
    });
}


/*
function checkFilter(selection, state, whiteIsNext) {
    const position = state.position
    const selectedPiece = state.position[selection];

    let nextState = JSON.parse(JSON.stringify(state));
    let nextPosition = nextState.position;

    return movesLogic[selectedPiece.type](selection,state)
    .filter( (square,index) => {
        nextPosition[square] = nextPosition[selection];
        nextPosition[selection] = {type: null};
        return !checkDetector(nextState,whiteIsNext)
    });
}
*/