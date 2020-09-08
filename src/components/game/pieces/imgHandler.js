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


const white = {
    whitePawn: whitepawn,
    knight: whiteknight,
    bishop: whitebishop,
    rook: whiterook,
    queen: whitequeen,
    king: whiteking,
}
const black = {
    blackPawn: blackpawn,
    knight: blackknight,
    bishop: blackbishop,
    rook: blackrook,
    queen: blackqueen,
    king: blackking,
}

const pieces ={
    white: white,
    black: black
}

export function imgHandler(color,type) {
    return pieces[color][type];
}




