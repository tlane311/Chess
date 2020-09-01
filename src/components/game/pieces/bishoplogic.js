import { collisionDetector } from './helperfunctions.js';

export function bishopLogic(selection, state) {
    let leftReducedSelection = selection%9;
    let rightReducedSelection = selection%7;

    let leftMoves;
    let rightMoves;

    //left moves logic
    if (leftReducedSelection!==8 && (leftReducedSelection<=selection%8)) {
        //above the diagonal logic
        leftMoves = [0,9,18,27,36,45,54,63]
        .filter( (number, index) => index <= 7 - leftReducedSelection)
        .map(number => leftReducedSelection+number)
        .filter(number => number!==selection);
    } else {
        //below the diagonal logic
        leftMoves = [0,9,18,27,36,45,54,63]
        .filter( (number,index) => index > 8 - leftReducedSelection)
        .map( number => number - (9 - leftReducedSelection))
        .filter(number => number!==selection);
    }
    //right moves logic
    if (rightReducedSelection >= selection%8 && selection <56) {//above the diagonal logic
        rightMoves = [7,14,21,28,35,42,49,56]
        .filter( (number, index) => index <= rightReducedSelection)
        .map(number => (rightReducedSelection - 7) + number)
        .filter(number => number!==selection);
    } else {//below the diagonal logic
        if (selection===63) { rightReducedSelection = 7 } //63 needs special attention
        rightMoves = [7,14,21,28,35,42,49,56]
        .filter( (number,index) => index >= rightReducedSelection)
        .map( number => number + rightReducedSelection)
        .filter(number => number!==selection);
    }
    leftMoves = collisionDetector(selection, leftMoves, state);
    rightMoves = collisionDetector(selection, rightMoves, state);

    return leftMoves.concat(rightMoves);
}