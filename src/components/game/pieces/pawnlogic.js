/*jslint es6 */
export function whitePawnLogic(selection, state) {
    const position = state.position;
    const initial = [-7,-8,-9,-16];

    //en Passant logic
    const oppositePawn = 'blackPawn';

    const leftAdjacentIsPawn = selection%8 > 0 ? position[selection-1].type === oppositePawn : false;
    const leftAdjacentIsPassing = Boolean(state.enPassant[position[selection-1].id]);

    const rightAdjacentIsPawn = selection%8 < 8 ? position[selection+1].type === oppositePawn : false;
    const rightAdjacentIsPassing = Boolean(state.enPassant[position[selection+1].id]);

    let enPassantMoves=[];
    if (leftAdjacentIsPawn && leftAdjacentIsPassing) {
        enPassantMoves.push(selection - 9);
    }
    if (rightAdjacentIsPawn && rightAdjacentIsPassing) {
        enPassantMoves.push(selection - 7);
    }

    //putting everything together
    return initial.filter( (number) => number!==-16 || selection - selection%8 ===48) //detect if pawn has moved
            .map( (number) => number + selection ) //translate to selection
            .filter( (square) => square%8 - selection%8 < 2 && square%8 - selection%8 > -2) //wall detection
            .filter( square => { //filtering collisions/blocking
                const forwardOnePossible = square - selection ===-8 && position[square].type ===null;
                const forwardTwoPossible = square - selection === -16 && position[square + 8].type === null && position[square].type ===null;
                const takeLeftOrRight = selection%8 !== square%8 && position[square].type !==null && position[square].color !==position[selection].color ;
                return forwardOnePossible || forwardTwoPossible || takeLeftOrRight;
            })
            .concat(enPassantMoves)
            .filter(square => square < 64 && square >= 0);
}

export function blackPawnLogic(selection, state) {
    const position = state.position;
    const initial = [7,8,9,16];

    //en Passant logic
    const oppositePawn = 'whitePawn';

    const leftAdjacentIsPawn = selection%8 > 0 ? position[selection-1].type === oppositePawn : false;
    const leftAdjacentIsPassing = Boolean(state.enPassant[position[selection-1].id]);

    const rightAdjacentIsPawn = selection%8 < 8 ? position[selection+1].type === oppositePawn : false;
    const rightAdjacentIsPassing = Boolean(state.enPassant[position[selection+1].id]);

    let enPassantMoves=[];
    if (leftAdjacentIsPawn && leftAdjacentIsPassing) {
        enPassantMoves.push(selection + 7);
    }
    if (rightAdjacentIsPawn && rightAdjacentIsPassing) {
        enPassantMoves.push(selection + 9);
    }

    //putting everything together
    return initial.filter( (number) => number!==16 || selection - selection %8 ===8) //detect if pawn has moved
            .map( (number) => number + selection ) //translate to selection
            .filter( (square) => square%8 - selection%8 < 2 && square%8 - selection%8 > -2) //wall detection
            .filter( square => { //filtering collisions/blocking
                const forwardOnePossible = square - selection ===8 && position[square].type ===null;
                const forwardTwoPossible = square - selection ===16 && position[square - 8].type === null && position[square].type ===null;
                const takeLeftOrRight = selection%8 !== square%8 && position[square].type !==null && position[square].color !==position[selection].color ;
                return forwardOnePossible || forwardTwoPossible || takeLeftOrRight;
            })
            .concat(enPassantMoves)
            .filter(square => square < 64 && square >= 0);
}