import { collisionDetector } from './helperfunctions.js';

function rookLogic(selection,state){
    const reducedSelection=selection%8;

    let horizontalMoves = [0,1,2,3,4,5,6,7]
    .filter( number => number !== reducedSelection)
    .map(number => selection - reducedSelection + number);

    horizontalMoves = collisionDetector(selection,horizontalMoves,state);


    let verticalMoves = [0,8,16,24,32,40,48,56]
    .filter(number => number !== selection - reducedSelection)
    .map( number => number + reducedSelection);

    verticalMoves=collisionDetector(selection,verticalMoves,state);

    return horizontalMoves.concat(verticalMoves);
}