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

