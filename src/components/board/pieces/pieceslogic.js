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


//review naiveMovesLogic for DRY/WET
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
            .filter(number => number%8 - selection%8 < 2 && number%8 - selection%8 > -2) //wall detection
        },
    blackPawn: function (selection) {
            return [7,8,9]
            .map(number => number + selection)
            .filter(number => number%8 - selection%8 < 2 && number%8 - selection%8 > -2) //wall detection
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

    // bishop logic is based upon modular arithmetic
    // squares %9 lay on decreasing diagonal (left-to-right)
    // squares %7 lay on increasing diagonal (left-to-right)
    // the tricky part is dealing with hitting the side of the board
    // the idea is to translate central diagonals and truncate dynamically
    // do not mess with unless you want to spend 8 hours making sure you didn't break it
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
                if (selection===63) { rightReducedSelection = 7 } //63 needs special attention
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

//booleanArrayBuilder depends upon position object
function booleanArrayBuilder(naiveMoves, selection, position) {
    const oppositeColor = position[selection].color ==="white" ? "black" : "white";
    const splittingIndex = naiveMoves.filter( number => number - selection < 0).length;

    const arrayOfSquares = naiveMoves.map(number => position[number]);
    const arrayOfColors = arrayOfSquares.map( square => square.type === null ? null : square.color); 

    const firstOppositeColorSquares = indicesClosestTo(arrayOfColors,splittingIndex,oppositeColor);
    //Note, indicesClosestTo returns an array with two elements. the first element can be -1 if no matches are found and the second can be Infinity if no matches are found

    let booleanArray = arrayOfColors.map(color => color!==null ? false : true);

    if (firstOppositeColorSquares[0] > -1) {
        booleanArray[firstOppositeColorSquares[0]]=true;
    }
    if (firstOppositeColorSquares[1] < Infinity) {
        booleanArray[firstOppositeColorSquares[0]]=true;
    }

    return booleanArray;
}
//for next function
//center = splittingIndex = naiveMoves.filter( number => number - selection < 0).length;

//independent function maybe reusable
function collisionDetector (arrayToBeFiltered, booleanArray, splittingIndex){
    const firstCollisionSquares = indicesClosestTo(booleanArray, splittingIndex, false);
    const firstIndex = firstCollisionSquares[0];
    const secondIndex = firstCollisionSquares[1];

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
    bishop: function (selection, position) {
        const leftMoves = naiveMovesLogic.bishop(selection) //recover leftMoves
        .filter(number => number%9===selection%9);

        const leftBooleanArray = booleanArrayBuilder(leftMoves,selection,position);
        const leftSplittingIndex = leftMoves.filter( number => number - selection < 0).length;
        const filteredLeftMoves = collisionDetector(leftMoves, leftBooleanArray, leftSplittingIndex );


        const rightMoves = naiveMovesLogic.bishop(selection)
        .filter(number => number%8===selection%8);

        const rightBooleanArray = booleanArrayBuilder(rightMoves,selection,position);
        const rightSplittingIndex = rightMoves.filter( number => number - selection < 0).length;
        const filteredRightMoves = collisionDetector(rightMoves, rightBooleanArray, rightSplittingIndex);

        return filteredLeftMoves.concat(filteredRightMoves);
    },

    rook: function (selection, position) {
        const horizontalMoves = naiveMovesLogic.rook(selection) //recover horizontalMoves
        .filter(number => (number - number%8)===(selection - selection%8));

        const horizontalBooleanArray = booleanArrayBuilder(horizontalMoves,selection,position);
        const horizontalSplittingIndex = horizontalMoves.filter( number => number - selection < 0).length;
        const filteredHorizontalMoves = collisionDetector(horizontalMoves, horizontalBooleanArray, horizontalSplittingIndex );


        const verticalMoves = naiveMovesLogic.rook(selection)
        .filter(number => number%8===selection%8);

        const verticalBooleanArray = booleanArrayBuilder(verticalMoves,selection,position);
        const verticalSplittingIndex = verticalMoves.filter( number => number - selection < 0).length;
        const filteredVerticalMoves = collisionDetector(verticalMoves, verticalBooleanArray, verticalSplittingIndex);

        return filteredHorizontalMoves.concat(filteredVerticalMoves);
    },
    queen: function (selection,position) {
        return this.rook(selection,position).concat(this.bishop(selection,position));
    },
    king: function (selection,position) {
        return naiveMovesLogic.whitePawn(selection)
        .filter(number => !(position[number].type !==null && position[number].color==position[selection].color));
    }
}

let position = [{"type":"rook","color":"black","id":"a8","status":true},{"type":"knight","color":"black","id":"b8","status":true},{"type":"bishop","color":"black","id":"c8","status":true},{"type":"king","color":"black","id":"d8","status":true},{"type":"queen","color":"black","id":"e8","status":true},{"type":"bishop","color":"black","id":"f8","status":true},{"type":"knight","color":"black","id":"g8","status":true},{"type":null},{"type":"blackPawn","color":"black","id":"a7","status":true},{"type":"blackPawn","color":"black","id":"b7","status":true},{"type":"blackPawn","color":"black","id":"c7","status":true},{"type":"blackPawn","color":"black","id":"d7","status":true},{"type":null},{"type":"blackPawn","color":"black","id":"f7","status":true},{"type":"blackPawn","color":"black","id":"g7","status":true},{"type":null},{"type":null},{"type":null},{"type":null},{"type":null},{"type":"blackPawn","color":"black","id":"e7","status":true},{"type":null},{"type":null},{"type":"rook","color":"black","id":"h8","status":true},{"type":null},{"type":null},{"type":null},{"type":null},{"type":null},{"type":null},{"type":null},{"type":"blackPawn","color":"black","id":"h7","status":true},{"type":null},{"type":null},{"type":null},{"type":null},{"type":null},{"type":null},{"type":null},{"type":null},{"type":"whitePawn","color":"white","id":"a2","status":true},{"type":"whitePawn","color":"white","id":"b2","status":true},{"type":null},{"type":"whitePawn","color":"white","id":"d2","status":true},{"type":null},{"type":"knight","color":"white","id":"g1","status":true},{"type":null},{"type":null},{"type":null},{"type":null},{"type":"whitePawn","color":"white","id":"c2","status":true},{"type":null},{"type":"whitePawn","color":"white","id":"e2","status":true},{"type":"whitePawn","color":"white","id":"f2","status":true},{"type":"whitePawn","color":"white","id":"g2","status":true},{"type":"whitePawn","color":"white","id":"h2","status":true},{"type":"rook","color":"white","id":"a1","status":true},{"type":"knight","color":"white","id":"b1","status":true},{"type":"bishop","color":"white","id":"c1","status":true},{"type":"king","color":"white","id":"d1","status":true},{"type":"queen","color":"white","id":"e1","status":true},{"type":"bishop","color":"white","id":"f1","status":true},{"type":null},{"type":"rook","color":"white","id":"h1","status":true}]

console.log(
    collisionLogic.bishop(58,position),
    collisionLogic.rook(23,position)
)

//advancedPawnLogic