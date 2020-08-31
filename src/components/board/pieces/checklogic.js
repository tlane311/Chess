import { movesLogic } from "./pieceslogic"

export function checkDetector (state,whiteIsNext) {
    const color = !whiteIsNext ? "white" : "black";
    const kingPosition = state.kingPosition[color]; //gives a number in position array
    const position = state.position;

    let check = false;

    position.forEach(
        (square,index) => {
            if (square.type && square.color !== color) {
                if (movesLogic[square.type](index,state)
                .filter( number => number === kingPosition)
                .length)
                    check = check || true;
            }
            return null;
        }
    )

    return check;
}

