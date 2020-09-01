export function kingLogic(selection,state){
    const position = state.position;
    const kingColor = position[selection].color;
    let initial = [-9,-8,-7,-2,-1,1,2,7,8,9];
    if (!state.castleStatus[kingColor].queenside) {
        initial = initial.filter( number => number !==-2)
    }
    if (!state.castleStatus[kingColor].kingside){
        initial = initial.filter( number => number !==2)
    }

    return initial
    .filter( number => !( selection%8===0 && (number === 7 || number === -9 || number === -1) ) ) //wall&corner detection
    .filter( number => !( selection%8===7 && (number === -7 || number === 9 || number === 1) ) ) //wall&corner detection
    .map( number => selection+number )
    .filter( number => (number >=0 && number < 64) )    //keeping returned array clean of useless values
    .filter( square => !(position[square].type !==null && position[square].color===position[selection].color));
}