/*jslint es6 */
import { whitePawnLogic, blackPawnLogic } from "./pawnlogic";
import { knightLogic } from "./knightlogic";
import { bishopLogic } from "./bishoplogic";
import { rookLogic } from "./rooklogic";
import { queenLogic } from "./queenlogic";
import { kingLogic } from "./kinglogic";



///////////////////////////
//EXPORT

export const movesLogic = {
    whitePawn: whitePawnLogic,
    blackPawn: blackPawnLogic,
    knight: knightLogic,
    bishop: bishopLogic,
    rook: rookLogic,
    queen: queenLogic,
    king: kingLogic
}
///////////////////////////



















