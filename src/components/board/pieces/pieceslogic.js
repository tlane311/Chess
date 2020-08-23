/*jslint es6 */

export const movesLogic = {
    knight: function (selection) {
            return [-17,-15,-10,-6,6,10,15,17]
            .map(number => selection+number)
            .filter(number => number <= 63 && number >= 0)
            .filter(number => number%8 - selection%8 < 3 && number%8 - selection%8 > -3)
            .map(number => number);
        },
    whitePawn: function (selection) {
            return [-7,-8,-9]
            .map(number => number + selection)
            .filter(number => number%8 - selection%8 < 2 && number%8 - selection%8 > -2)
        },
    blackPawn: function (selection) {
            return [7,8,9]
            .map(number => number + selection)
            .filter(number => number%8 - selection%8 < 2 && number%8 - selection%8 > -2)
        },
    rook: function (selection) {
            let reducedSelection=selection%8;

            let horizontalMoves = [0,1,2,3,4,5,6,7]
            .filter( number => number !== reducedSelection)
            .map(number => selection - reducedSelection + number);

            let verticalMoves = [0,8,16,24,32,40,48,56]
            .filter(number => number !== selection - reducedSelection)
            .map( number => number + reducedSelection);

            return horizontalMoves.concat(verticalMoves);
        },
    bishop: function (selection) {
            let leftReducedSelection = selection%9;
            let rightReducedSelection = selection%7;

            //left moves logic
            if (leftReducedSelection!==8 && (leftReducedSelection<=selection%8)) {
                //above the diagonal logic
                var leftMoves = [0,9,18,27,36,45,54,63]
                .filter( (number, index) => index <= 7 - leftReducedSelection)
                .map(number => leftReducedSelection+number)
                .filter(number => number!==selection);
            } else {
                //below the diagonal logic
                var leftMoves = [0,9,18,27,36,45,54,63]
                .filter( (number,index) => index > 8 - leftReducedSelection)
                .map( number => number - (9 - leftReducedSelection))
                .filter(number => number!==selection);
            }
            //right moves logic
            if (rightReducedSelection >= selection%8 && selection <56) {//above the diagonal logic
                var rightMoves = [7,14,21,28,35,42,49,56]
                .filter( (number, index) => index <= rightReducedSelection)
                .map(number => (rightReducedSelection - 7) + number)
                .filter(number => number!==selection);
            } else {//below the diagonal logic
                if (selection===63) { rightReducedSelection=7 } //63 needs special attention
                var rightMoves = [7,14,21,28,35,42,49,56]
                .filter( (number,index) => index >= rightReducedSelection)
                .map( number => number + rightReducedSelection)
                .filter(number => number!==selection);
            }
            return leftMoves.concat(rightMoves);
        },
    queen: function (selection) {
        return this.rook(selection).concat(this.bishop(selection));
        },
    king: function (selection) {
        return [-9,-8,-7,-1,1,7,8,9]
        .filter( number => !( selection%8===0 && (number === 7 || number === -9 || number === -1) ) ) //wall&corner detection
        .filter( number => !( selection%8===7 && (number === -7 || number === 9 || number === 1) ) )
        .map( number => selection+number )
        .filter( number => (number >=0 && number < 64) );
        }
}

console.log(
    movesLogic.knight(1),
);










    //retrieve selected
    //if piece is not null
        //calculate possible moves based on type
    //lets start with knight

    //selection=number between 0 and 63
    //position is an array of pieces and nulls
