import { bishopLogic } from './bishoplogic.js';
import { rookLogic } from './rooklogic.js';

function queenLogic(selection, state) {
    return bishopLogic(selection,state).concat(rookLogic(selection,state));
}