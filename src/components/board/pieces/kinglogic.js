export function kingLogic(selection,state){
    const position = state.position;
    const initial = [-9,-8,-7,-1,1,7,8,9];
    return initial
    .filter( number => !( selection%8===0 && (number === 7 || number === -9 || number === -1) ) ) //wall&corner detection
    .filter( number => !( selection%8===7 && (number === -7 || number === 9 || number === 1) ) ) //wall&corner detection
    .map( number => selection+number )
    .filter( number => (number >=0 && number < 64) )    //keeping returned array clean of useless values
    .filter( square => !(position[square].type !==null && position[square].color===position[selection].color));
}