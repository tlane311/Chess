export const knightLogic = function(selection, state) {
    const position = state.position;
    const initial = [-17,-15,-10,-6,6,10,15,17];
    return initial
    .map( number => selection + number)
    //below filters wall collision
    .filter( square => square <= 63 && square >= 0 && square%8 - selection%8 < 3 && square%8 - selection%8 > -3)
    .filter(square => !(position[square].type !==null && position[square].color===position[selection].color));
}