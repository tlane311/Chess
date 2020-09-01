import { movesLogic } from "./pieceslogic"

//whiteIsNext=true => white's turns really whiteIsNext=whiteTurn

export function checkDetector (state,whiteIsNext) {
    const currentColor = whiteIsNext ? "white": "black"; //white

    const kingPosition = state.position
    .map( object => object.type && object.color===currentColor ? object.type : null)
    .indexOf( "king"); //white king is located
    const position = state.position;


    let checkCallBack = (square, index) => {
        return square.type && square.color !== currentColor
        ? movesLogic[square.type](index,state)
        .filter( number => number === kingPosition)
        .length
        : false;
    }

    const check = position.some( checkCallBack );

    return check;
}

export function checkFilter (unfilteredMoves, selection, state, whiteIsNext){
    const filterCallback = (square) => {
        let nextState = JSON.parse(JSON.stringify(state));  //make copy of board to avoid mutation problems
        let nextPosition = nextState.position;
        nextPosition[square] = nextPosition[selection];     //execute the move
        nextPosition[selection] = {type: null};             //clear up old space
        return !checkDetector(nextState,whiteIsNext)
    }

    if (state.position[selection].type !=="king") {
        return unfilteredMoves.filter( filterCallback);
    } else { //for king, you can't castle out of or through check
        let firstFilter = unfilteredMoves.filter(filterCallback);

        if (!firstFilter.map(square => square - selection).some(number => number === 1)) {
            firstFilter=firstFilter.filter( square => square - selection!==2);
        }
        if (!firstFilter.map(square => square - selection).some(number => number === -1)) {
            firstFilter=firstFilter.filter( square => square - selection!==-2);
        }
        if (checkDetector(state,whiteIsNext)){
            firstFilter=firstFilter.filter( square => square - selection !==2 || square - selection !== -2);
        }
        return firstFilter;
    }
}



export function checkmateDetector(state, whiteIsNext) {
    if (checkDetector(state, whiteIsNext)){

        const currentColor = whiteIsNext ? "white": "black"; //white
        const position = state.position;


        return !position.some(
            (square,index) => {
                if (square.type && square.color === currentColor){
                    let unfilteredMoves = movesLogic[square.type](index,state);
                    return checkFilter(unfilteredMoves,index,state, whiteIsNext).length;
                } else {
                    return false;
                }
            }
        ) // returns true if there is some square with filtered length > 0 else returns false
    } else {
        return false;
    }
}

/*


*/