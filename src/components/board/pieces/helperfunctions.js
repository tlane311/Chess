//auxillary functions to help with collisionLogic

export function collisionDetector (selection, naiveMoves, state){
    const position = state.position;

    let firstIndex = naiveMoves
    .filter(square => selection - square > 0)
    .map( square => position[square])
    .lastIndexOf( square.type!==null);

    let secondIndex=naiveMoves
    .map(square => selection - square <= 0 ? {type: null} : position[square])
    .indexOf( square.type!==null);

    const firstIndexCanBeTaken = position[naiveMoves[firstIndex]].color !== position[selection].color;
    const secondIndexCanBeTaken = position[naiveMoves[secondIndex]].color !== position[selection].color;

    if (!firstIndexCanBeTaken) { firstIndex++; } //increment initial index to exclude with slice
    if (secondIndexCanBeTaken) { secondIndex++; } //increment final index to include with slice

    return naiveMoves.slice(firstIndex,secondIndex);
}