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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

const naiveMovesLogic = {
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

//auxillary functions to help with collisionLogic

//independent function maybe reusable
function indicesClosestTo(array,index,value) { //this splits based on index
    const leftChunk=array.slice(0,index);
    const rightChunk=array.slice(index);

    const firstIndex = leftChunk.lastIndexOf(value);
    const secondIndex = rightChunk.indexOf(value)===-1 ? Infinity: rightChunk.indexOf(value);

    return [firstIndex, leftChunk.length + secondIndex];
}

//booleanArrayBuilder depends upon my chess logic
function booleanArrayBuilder(naiveMoves, selection, position) {
    const oppositeColor = position[selection].color ==="white" ? "black" : "white";
    const splittingIndex = naiveMoves.filter( number => number - selection < 0).length;

    const arrayOfSquares = naiveMoves.map(number => position[number]);
    const arrayOfColors = arrayOfSquares.map( square => {square.type === null ? null : square.color} );

    const firstOppositeColorSquares = indicesClosestTo(arrayOfColors,splittingIndex,oppositeColor);
    //Note, indicesClosestTo returns an array with two elements. the first element can be -1 if no matches are found and the second can be Infinity if no matches are found

    let booleanArray = arrayOfColors.map(color => color!== null ? false : true);

    if (firstOppositeColorSquares[0] > -1) {
        booleanArray[firstOppositeColorSquares[0]]=true;
    }
    if (firstOppositeColorSquares[1] < Infinity) {
        booleanArray[firstOppositeColorSquares[0]]=true;
    }

    return booleanArray
}

//center = splittingIndex = naiveMoves.filter( number => number - selection < 0).length;

//independent function maybe reusable
function collisionDetector (arrayToBeFiltered, booleanArray, center){
    const firstCollisionSquares = indicesClosestTo(booleanArray, center, false);
    const firstIndex = firstCollisionSquares[0]
    const secondIndex = firstCollisionSquares[1]


    return arrayToBeFiltered.slice(firstIndex+1,secondIndex);
}





//collisionLogic
const collisionLogic = {
    whitePawn: function (selection, position) {
            return naiveMovesLogic.whitePawn(selection)
            .filter(number => !(position[number].type !==null && position[number].color==position[selection].color));
        },
    blackPawn: function (selection, position) {
        return naiveMovesLogic.blackPawn(selection)
        .filter(number => !(position[number].type !==null && position[number].color==position[selection].color));
    },
    knight: function (selection, position){
        return naiveMovesLogic.knight(selection)
        .filter(number => !(position[number].type !==null && position[number].color==position[selection].color));
    },
    bishop: null,
    rook: function (selection, position) {
        let horizontalMoves=naiveMovesLogic.rook(selection) //recover horizontalMoves
        .filter(number => (number - number%8)===(selection - selection%8));

        horizontalMoves
        .map( square => {
            if (square.type){
                return square.color
            } else {
                return null;
            }
        })

        .lastIndexOf(position[selection].color)
        .indexOf(position[selection].color)


        return
    },
    queen: null,
    king: null
}

let position = [
    {//0
        type: "pawn",
        color: "black"
    },
    1,
    {
        type: "pawn",
        color: "black"
    },3,4,5,6,7,
    {//8
        type: "pawn",
        color: "white"
    },
    {//9
        type: "pawn",
        color: "white"
    },
    {//10
        type: "queen",
        color: "white"
    }
    ,11,12,13,14,15,
    {//16
        type: "pawn",
        color: "black"
    },
    {//17
        type: "pawn",
        color: "black"
    },
    18,19,20,21,22,23,24,25,26,27,
    28,29,30,31,32,33,34,35,36,37,
    38,39,40,41,42,43,44,45,46,47,
    48,49,50,51,52,53,54,55,56,57,
    58,59,60,61,62,63
]
console.log(
    collisionLogic.blackPawn(0,position),
    collisionLogic.knight(0,position),
    collisionLogic.rook(0,position)
)

//advancedPawnLogic