//auxillary functions to help with collisionLogic
export function collisionDetector (selection, naiveMoves, state){
    const position = state.position;

    let firstIndex = naiveMoves
    .filter(square => selection - square > 0)
    .map( square => position[square].type)
    .map( type => type ? "piece" : null  )
    .lastIndexOf('piece');

    let secondIndex=naiveMoves
    .map(square => selection - square >= 0 ? null : position[square].type)
    .map( type => type ? "piece" : null )
    .indexOf('piece');

    if (firstIndex===-1) { firstIndex = 0;}
    if (secondIndex===-1) { secondIndex=Infinity;}

    const firstIndexCanBeTaken = firstIndex===-1
    ? true
    : position[naiveMoves[firstIndex]].color !== position[selection].color;
    
    const secondIndexCanBeTaken = secondIndex===Infinity
    ? true
    : position[naiveMoves[secondIndex]].color !== position[selection].color;

    if (!firstIndexCanBeTaken) { firstIndex++; } //increment initial index to exclude with slice
    if (secondIndexCanBeTaken) { secondIndex++; } //increment final index to include with slice

    return naiveMoves.slice(firstIndex,secondIndex);
}