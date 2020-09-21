import blackbishop from "../../../images/chesspieces/blackbishop.svg";
import blackrook from "../../../images/chesspieces/blackrook.svg";
import blackpawn from "../../../images/chesspieces/blackpawn.svg";
import blackknight from "../../../images/chesspieces/blackknight.svg";
import blackqueen from "../../../images/chesspieces/blackqueen.svg";
import blackking from "../../../images/chesspieces/blackking.svg";

import whitebishop from "../../../images/chesspieces/whitebishop.svg";
import whiterook from "../../../images/chesspieces/whiterook.svg";
import whitepawn from "../../../images/chesspieces/whitepawn.svg";
import whiteknight from "../../../images/chesspieces/whiteknight.svg";
import whitequeen from "../../../images/chesspieces/whitequeen.svg";
import whiteking from "../../../images/chesspieces/whiteking.svg";


const blackPieces = [
    {type: "rook",
    color: "black",
    id: "a8",
    img: blackrook
    },
    {type: "knight",
    color: "black",
    id: "b8",
    img: blackknight
    },
    {type: "bishop",
    color: "black",
    id: "c8",
    img: blackbishop
    },
    {type: "queen",
    color: "black",
    id: "d8",
    img: blackqueen
    },
    {type: "king",
    color: "black",
    id: "e8",
    img: blackking
    },
    {type: "bishop",
    color: "black",
    id: "f8",
    img: blackbishop
    },
    {type: "knight",
    color: "black",
    id: "g8",
    img: blackknight
    },
    {type: "rook",
    color: "black",
    id: "h8",
    img: blackrook
    },
    {type: "blackPawn",
    color: "black",
    id: "a7",
    img: blackpawn
    },
    {type: "blackPawn",
    color: "black",
    id: "b7",
    img: blackpawn
    },
    {type: "blackPawn",
    color: "black",
    id: "c7",
    img: blackpawn
    },
    {type: "blackPawn",
    color: "black",
    id: "d7",
    img: blackpawn
    },
    {type: "blackPawn",
    color: "black",
    id: "e7",
    img: blackpawn
    },
    {type: "blackPawn",
    color: "black",
    id: "f7",
    img: blackpawn
    },
    {type: "blackPawn",
    color: "black",
    id: "g7",
    img: blackpawn
    },
    {type: "blackPawn",
    color: "black",
    id: "h7",
    img: blackpawn
    },
]

const whitePieces = [
    {type: "whitePawn",
    color: "white",
    id: "a2",
    img: whitepawn
    },
    {type: "whitePawn",
    color: "white",
    id: "b2",
    img: whitepawn
    },
    {type: "whitePawn",
    color: "white",
    id: "c2",
    img: whitepawn
    },
    {type: "whitePawn",
    color: "white",
    id: "d2",
    img: whitepawn
    },
    {type: "whitePawn",
    color: "white",
    id: "e2",
    img: whitepawn
    },
    {type: "whitePawn",
    color: "white",
    id: "f2",
    img: whitepawn
    },
    {type: "whitePawn",
    color: "white",
    id: "g2",
    img: whitepawn
    },
    {type: "whitePawn",
    color: "white",
    id: "h2",
    img: whitepawn
    },
    {type: "rook",
    color: "white",
    id: "a1",
    img: whiterook
    },
    {type: "knight",
    color: "white",
    id: "b1",
    img: whiteknight
    },
    {type: "bishop",
    color: "white",
    id: "c1",
    img: whitebishop
    },
    {type: "queen",
    color: "white",
    id: "d1",
    img: whitequeen
    },
    {type: "king",
    color: "white",
    id: "e1",
    img: whiteking
    },
    {type: "bishop",
    color: "white",
    id: "f1",
    img: whitebishop
    },
    {type: "knight",
    color: "white",
    id: "g1",
    img: whiteknight
    },
    {type: "rook",
    color: "white",
    id: "h1",
    img: whiterook
    },
]

export const firstPosition = {
    position: blackPieces.slice()
    .concat(Array(32).fill({type:null})).concat(whitePieces.slice()),

    check: {
        white: false,
        black: false
    },
    castleStatus:{
        white: {
            queenside: true,
            kingside: true
        },
        black: {
            queenside: true,
            kingside: true
        }
    },
    enPassant: {},
    takenWhitePieces: [],
    takenBlackPieces: []
}
const test = "string"
export { test }

export function piecesCompareFunction(firstPieceType,secondPieceType){
    if (firstPieceType===secondPieceType) return 0;
    if (firstPieceType==="queen") return 1;
    if (firstPieceType==="whitePawn"||firstPieceType==="blackPawn") return -1;
    if (firstPieceType==="rook" && (secondPieceType==="bishop"||secondPieceType==="knight")) return 1;
    if (firstPieceType==="bishop" && secondPieceType==="knight") return 1;
    if (firstPieceType==="knight" && (secondPieceType==="bishop" || secondPieceType==="rook")) return -1;
    if (firstPieceType==="bishop"&&secondPieceType==="rook") return -1;
    if (secondPieceType==="queen") return -1;
    if (secondPieceType==="whitePawn"||secondPieceType==="blackPawn") return 1;
}