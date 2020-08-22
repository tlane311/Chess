/*jslint es6 */

const blackPieces = [ 
    {type: "rook",
    color: "black",
    id: "a8",
    status: true,
    },
    {type: "knight",
    color: "black",
    id: "b8",
    status: true,
    },
    {type: "bishop",
    color: "black",
    id: "c8",
    status: true,
    },
    {type: "king",
    color: "black",
    id: "d8",
    status: true,
    },
    {type: "queen",
    color: "black",
    id: "e8",
    status: true,
    },
    {type: "bishop",
    color: "black",
    id: "f8",
    status: true,
    },
    {type: "knight",
    color: "black",
    id: "g8",
    status: true,
    },
    {type: "rook",
    color: "black",
    id: "h8",
    status: true,
    },
    {type: "pawn",
    color: "black",
    id: "a7",
    status: true,
    },
    {type: "pawn",
    color: "black",
    id: "b7",
    status: true,
    },
    {type: "pawn",
    color: "black",
    id: "c7",
    status: true,
    },
    {type: "pawn",
    color: "black",
    id: "d7",
    status: true,
    },
    {type: "pawn",
    color: "black",
    id: "e7",
    status: true,
    },
    {type: "pawn",
    color: "black",
    id: "f7",
    status: true,
    },
    {type: "pawn",
    color: "black",
    id: "g7",
    status: true,
    },
    {type: "pawn",
    color: "black",
    id: "h7",
    status: true,
    },
]
const whitePieces = [
    {type: "pawn",
    color: "white",
    id: "a2",
    status: true, //true for active, false for deceased
    },
    {type: "pawn",
    color: "white",
    id: "b2",
    status: true,
    },
    {type: "pawn",
    color: "white",
    id: "c2",
    status: true,
    },
    {type: "pawn",
    color: "white",
    id: "d2",
    status: true,
    },
    {type: "pawn",
    color: "white",
    id: "e2",
    status: true,
    },
    {type: "pawn",
    color: "white",
    id: "f2",
    status: true,
    },
    {type: "pawn",
    color: "white",
    id: "g2",
    status: true,
    },
    {type: "pawn",
    color: "white",
    id: "h2",
    status: true,
    },
    {type: "rook",
    color: "white",
    id: "a1",
    status: true,
    },
    {type: "knight",
    color: "white",
    id: "b1",
    status: true,
    },
    {type: "bishop",
    color: "white",
    id: "c1",
    status: true,
    },
    {type: "king",
    color: "white",
    id: "d1",
    status: true,
    },
    {type: "queen",
    color: "white",
    id: "e1",
    status: true,
    },
    {type: "bishop",
    color: "white",
    id: "f1",
    status: true,
    },
    {type: "knight",
    color: "white",
    id: "g1",
    status: true,
    },
    {type: "rook",
    color: "white",
    id: "h1",
    status: true,
    },
]
const firstPosition = {
    position: blackPieces.slice().concat(Array(32).fill({type:null})).concat(whitePieces.slice()),
    check: {
        white: false,
        black: false
    },
    sleepingPawns: {
        a2: true,
        b2: true,
        c2: true,
        d2: true,
        e2: true,
        f2: true,
        g2: true,
        h2: true,
        a7: true,
        b7: true,
        c7: true,
        d7: true,
        e7: true,
        f7: true,
        g7: true,
        h7: true
    },
    sleepingKing:{
        white: {
            queenside: true,
            kingside: true
        },
        black: {
            queenside: true,
            kingside: true
        }
    },
    enPassant:{
    }
}


movesLogic = {
    knight: function (selection) {
            return [].concat(
                selection - 17, 
                selection - 15,
                selection + 15,
                selection + 17)
            .filter(
                number => number >=0 && number < 64
            );
        },
    pawn: function (selection) {
            return [].concat(selection+7, selection+8, selection+9);
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
    movesLogic.pawn(37),
    movesLogic.knight(37),
    movesLogic.rook(37),
    movesLogic.bishop(37),
    movesLogic.queen(37),
    movesLogic.king(50)
);










    //retrieve selected
    //if piece is not null
        //calculate possible moves based on type
    //lets start with knight

    //selection=number between 0 and 63
    //position is an array of pieces and nulls
