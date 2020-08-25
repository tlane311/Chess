/*jslint es6 */

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
        .filter( number => !( selection%8===7 && (number === -7 || number === 9 || number === 1) ) ) //wall&corner detection
        .map( number => selection+number )
        .filter( number => (number >=0 && number < 64) ); //keeping returned array clean of useless values
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
    const [firstIndex, secondIndex] = indicesClosestTo(arrayOfColors,splittingIndex,oppositeColor);
    //Note, indicesClosestTo returns an array with two elements. the first element can be -1 if no matches are found and the second can be Infinity if no matches are found

    let booleanArray = arrayOfColors.map(color => color!==null ? false : true);

    if (firstIndex > -1) {
        booleanArray[firstIndex]=true;
        let leftOfSlice = Array(firstIndex).fill(false);
        booleanArray = leftOfSlice.concat(booleanArray.slice(firstIndex))
    }

    if (secondIndex < Infinity) {
        booleanArray[secondIndex]=true;
        let rightOfSlice = Array(naiveMoves.length - secondIndex - 1).fill(false);
        booleanArray = booleanArray.slice(0,secondIndex+1).concat(rightOfSlice)
    }

    return booleanArray;
}

//independent function maybe reusable
function collisionDetector (arrayToBeFiltered, booleanArray, splittingIndex){
    const [firstIndex, secondIndex] = indicesClosestTo(booleanArray, splittingIndex, false);

    return arrayToBeFiltered.slice(firstIndex+1,secondIndex);
}

//even easier way:
    //just slice at the first piece you encounter
    //if opposite color include then slice
    //otherwise just cut everything

//advancedPawnLogic




//collisionLogic
const collisionLogic = {
    whitePawn: function (selection, state) {
        return naiveMovesLogic.whitePawn(selection)
        .filter(square => !(state.position[square].type !==null && state.position[square].color==state.position[selection].color))
        .filter(square => (selection%8 === square%8 && state.position[square].type ===null) || (selection%8 !== square%8 && state.position[square].type !==null) );
        },
    blackPawn: function (selection, state) {
        return naiveMovesLogic.blackPawn(selection)
        .filter(square => !(state.position[square].type !==null && state.position[square].color==state.position[selection].color))
        .filter(square => (selection%8 === square%8 && state.position[square].type ===null) || (selection%8 !== square%8 && state.position[square].type !==null) );
    },
    knight: function (selection, state){
        return naiveMovesLogic.knight(selection)
        .filter(square => !(state.position[square].type !==null && state.position[square].color==state.position[selection].color));
    },
    bishop: function (selection, state) {
        const position = state.position;
        const leftMoves = naiveMovesLogic.bishop(selection) //recover decreasing diagonal moves
        .filter(square => square%9===selection%9);

        const leftBooleanArray = booleanArrayBuilder(leftMoves,selection,position);
        const leftSplittingIndex = leftMoves.filter( square => square - selection < 0).length;
        const filteredLeftMoves = collisionDetector(leftMoves, leftBooleanArray, leftSplittingIndex );


        const rightMoves = naiveMovesLogic.bishop(selection) //recover increasing diagonal moves
        .filter(square => square%7===selection%7);

        const rightBooleanArray = booleanArrayBuilder(rightMoves,selection,position);
        const rightSplittingIndex = rightMoves.filter( square => square - selection < 0).length;
        const filteredRightMoves = collisionDetector(rightMoves, rightBooleanArray, rightSplittingIndex);

        return filteredLeftMoves.concat(filteredRightMoves);
    },

    rook: function (selection, state) {
        const position=state.position;
        const horizontalMoves = naiveMovesLogic.rook(selection) //recover horizontal moves
        .filter(square => (square - square%8)===(selection - selection%8));

        const horizontalBooleanArray = booleanArrayBuilder(horizontalMoves,selection,position);
        const horizontalSplittingIndex = horizontalMoves.filter( square => square - selection < 0).length;
        const filteredHorizontalMoves = collisionDetector(horizontalMoves, horizontalBooleanArray, horizontalSplittingIndex );


        const verticalMoves = naiveMovesLogic.rook(selection) //recover vertical moves
        .filter(square => square%8===selection%8);

        const verticalBooleanArray = booleanArrayBuilder(verticalMoves,selection,position);
        const verticalSplittingIndex = verticalMoves.filter( square => square - selection < 0).length;
        const filteredVerticalMoves = collisionDetector(verticalMoves, verticalBooleanArray, verticalSplittingIndex);

        return filteredHorizontalMoves.concat(filteredVerticalMoves);
    },
    queen: function (selection,state) {
        return this.rook(selection,state).concat(this.bishop(selection,state));
    },
    king: function (selection,state) {
        return naiveMovesLogic.king(selection)
        .filter(square => !(state.position[square].type !==null && state.position[square].color==state.position[selection].color));
    }
}

const advancedPawnLogic = {
    whitePawn: function (selection,state) {
        //en Passant logic
        const oppositePawn = state.position[selection].type === "whitePawn" ? "blackPawn" : "whitePawn";
        const leftAdjacentIsPawn = selection%8 > 0 ? state.position[selection-1].type === oppositePawn : false;
        const leftAdjacentIsPassing = Boolean(state.enPassant[state.position[selection-1].id]); 

        const rightAdjacentIsPawn = selection%8 < 8 ? state.position[selection+1].type === oppositePawn : false;
        const rightAdjacentIsPassing = Boolean(state.enPassant[state.position[selection+1].id]);

        let enPassantMoves=[];
        if (leftAdjacentIsPawn && leftAdjacentIsPassing) {
            enPassantMoves.push(selection - 9);
        }
        if (rightAdjacentIsPawn && rightAdjacentIsPassing) {
            enPassantMoves.push(selection - 7);
        }

        //first pawn move logic
        const sleepingBoolean = selection - selection %8 === 48;
        if (sleepingBoolean && state.position[selection-8].type===null && state.position[selection-16].type===null ) {
            return collisionLogic.whitePawn(selection,state).concat(selection-16).concat(enPassantMoves)
        } else {
            return collisionLogic.whitePawn(selection,state).concat(enPassantMoves)
        }
    },
    blackPawn: function (selection,state) {
        //en Passant logic
        const oppositePawn = state.position[selection].type === "whitePawn" ? "blackPawn" : "whitePawn";
        const leftAdjacentIsPawn = selection%8 > 0 ? state.position[selection-1].type === oppositePawn : false;
        const leftAdjacentIsPassing = Boolean(state.enPassant[state.position[selection-1].id]); 

        const rightAdjacentIsPawn = selection%8 < 8 ? state.position[selection+1].type === oppositePawn : false;
        const rightAdjacentIsPassing = Boolean(state.enPassant[state.position[selection+1].id]);

        let enPassantMoves=[];
        if (leftAdjacentIsPawn && leftAdjacentIsPassing) {
            enPassantMoves.push(selection + 7);
        }
        if (rightAdjacentIsPawn && rightAdjacentIsPassing) {
            enPassantMoves.push(selection + 9);
        }

        const sleepingBoolean = selection - selection %8 === 8;
        if (sleepingBoolean) {
            return collisionLogic.blackPawn(selection,state).concat(selection+16).concat(enPassantMoves)
        }
        else {
            return collisionLogic.blackPawn(selection,state).concat(enPassantMoves)
        }
    }
}

const castleLogic = {
    rook: null,
    king: null
}





















///////////////////////////
//EXPORT

export const movesLogic = {
    whitePawn: function (selection,state) {
        return advancedPawnLogic.whitePawn(selection,state);
        },
    blackPawn: function (selection,position) {
        return advancedPawnLogic.blackPawn(selection,position);
        },
    knight: function (selection,position) {
        return collisionLogic.knight(selection,position);
        },
    bishop: function (selection,position) {
        return collisionLogic.bishop(selection,position);
        },
    rook: function (selection,position) {
            return collisionLogic.rook(selection,position);
            },
    queen: function (selection,position) {
        return collisionLogic.queen(selection,position);
        },
    king: function (selection,position) {
        return collisionLogic.king(selection,position);
    }
}







//random position for testing purposes
let position = [
    {"type":"rook","color":"black","id":"a8","status":true}, //0
    {"type":"knight","color":"black","id":"b8","status":true}, //1
    {"type":"bishop","color":"black","id":"c8","status":true}, //2
    {"type":null}, //3
    {"type":"king","color":"black","id":"d8","status":true}, //4
    {"type":"bishop","color":"black","id":"f8","status":true}, //5
    {"type":"knight","color":"black","id":"g8","status":true}, //6
    {"type":"rook","color":"black","id":"h8","status":true}, //7
    {"type":"blackPawn","color":"black","id":"a7","status":true}, //8
    {"type":"blackPawn","color":"black","id":"b7","status":true}, //9
    {"type":null}, //10
    {"type":"blackPawn","color":"black","id":"d7","status":true}, //11
    {"type":"blackPawn","color":"black","id":"e7","status":true}, //12
    {"type":null}, //13
    {"type":"blackPawn","color":"black","id":"g7","status":true}, //14
    {"type":"blackPawn","color":"black","id":"h7","status":true}, //15
    {"type":null},{"type":null},{"type":null},{"type":null},{"type":null}, //20
    {"type":"blackPawn","color":"black","id":"f7","status":true}, //21
    {"type":null},{"type":null},{"type":null},{"type":null},{"type":null},{"type":null},{"type":null},{"type":null},{"type":null},{"type":null}, //31
    {"type":null}, //32 new row
    {"type":"queen","color":"white","id":"e1","status":true}, //33
    {"type":"blackPawn","color":"black","id":"c7","status":true}, //34
    {"type":null},{"type":null},{"type":null}, //37
    {"type":"queen","color":"black","id":"e8","status":true}, //38
    {"type":null}, //39 end of row
    {"type":null},{"type":null},{"type":null},{"type":null},{"type":"whitePawn","color":"white","id":"e2","status":true},{"type":"knight","color":"white","id":"g1","status":true},{"type":null},{"type":null},{"type":"whitePawn","color":"white","id":"a2","status":true},{"type":"whitePawn","color":"white","id":"b2","status":true},{"type":"whitePawn","color":"white","id":"c2","status":true},{"type":"whitePawn","color":"white","id":"d2","status":true},{"type":null},{"type":"whitePawn","color":"white","id":"f2","status":true},{"type":"whitePawn","color":"white","id":"g2","status":true},{"type":"whitePawn","color":"white","id":"h2","status":true},{"type":"rook","color":"white","id":"a1","status":true},{"type":"knight","color":"white","id":"b1","status":true},{"type":"bishop","color":"white","id":"c1","status":true},{"type":null},{"type":"king","color":"white","id":"d1","status":true},{"type":"bishop","color":"white","id":"f1","status":true},{"type":null},{"type":"rook","color":"white","id":"h1","status":true}]

