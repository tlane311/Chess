/*jslint es6 */

import React from 'react';
//import ReactDOM from 'react-dom';
import './board.css';
import { firstPosition } from './pieces/pieces.js';
import { movesLogic } from './pieces/pieceslogic.js'
import { checkFilter, checkmateDetector } from './pieces/checklogic.js'
import { promotionLocator } from './promoter/promoter.js';
import { TurnIndicator } from './turnindicator/turnindicator.js';
import { Board } from './board/board.js';
import { moveHelper, checkHelper, stateHelper} from './gamehelpers.js'




export class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [firstPosition],
            selected: null,
            whiteIsNext: true 
        };
    }

    possibleMoves(selected, state, whiteIsNext){ //returns array of moves
        if (selected !==null){ //conditional to avoid position[null].type which throws error

            if (state.position[selected].type){ //nonempty square selected
                return checkFilter(movesLogic[state.position[selected].type](selected,state), selected, state, whiteIsNext)
            } else { //empty square selected
                return []
            }

        } else { //selected===null
            return []
        }
    }

    squareisPossibleMove(square) {  //returns boolean describing if a given square is a possible move from selected
        const history = this.state.history;
        const selected = this.state.selected;
        const whiteIsNext = this.state.whiteIsNext;
        return Boolean(
            this.possibleMoves(selected, history[history.length -1], whiteIsNext)
            .filter(element => element === square)
            .length);
    }

    shade(square){//adds a css id to each square that decides shade
        const history = JSON.parse(JSON.stringify(this.state.history));
        let squareIsPossibleMove = this.squareisPossibleMove(square)
        
        if (square===this.state.selected  && history[history.length -1].position[square].type){
            //if square is selected and square is not empty
            return "selected"
        } else if (squareIsPossibleMove) {
            return "possibleMove"
        } else {
            //standard shading for chess board describing using modulo conditionals
            return (square%2===0 && square%16 <=7) || (square%2!==0 && square%16 >7) ? "light" : "dark";
        }
    }

    moveHandler(selection, nextSquare, history, whiteIsNext) {
        const oldHistory = JSON.parse(JSON.stringify(history));
        const freshHistory = JSON.parse(JSON.stringify(history)); //need multiple history because js keeps live references to subobjects
        const currentState = freshHistory[history.length - 1];

        let currentPosition = currentState.position.slice(); //copy
        let next=currentState; //redundant code but should make this bit more readable
        const nextSquareIsOccupied = Boolean(currentPosition[nextSquare].type);
        let nextPosition=currentState.position;
        if (nextSquareIsOccupied){
            whiteIsNext
            ? next.takenBlackPieces.push(currentPosition[nextSquare])
            : next.takenWhitePieces.push(currentPosition[nextSquare]);
        }
        next.enPassant={};
        moveHelper[currentPosition[selection].type](selection, nextSquare, next) //modifies next by moving pieces
        //next.position=nextPosition;
        //next.enPassant={}; <--add to moveHelper to reset enPassant
        //updates takenPieces

        checkHelper(next, whiteIsNext)

        stateHelper[nextPosition[nextSquare].type](selection,nextSquare,next)

        //every key of next should be updated at this point
        this.setState({
            history: oldHistory.concat(next),
            selected: null,
            whiteIsNext: !whiteIsNext
        });

    }




    handleClick(square) {
        const oldhistory = JSON.parse(JSON.stringify(this.state.history));
        const history = JSON.parse(JSON.stringify(this.state.history)); //need new history because js keeps live references to subobjects
        const current = history[history.length - 1];
        const selected = this.state.selected;
        const whiteIsNext = this.state.whiteIsNext;
            // A & B
        if (selected===null && current.position[square].type !== null && (current.position[square].color==="white")===whiteIsNext) {
            this.setState({
                selected: square
            });
        }
            //~(A && B) === ~A || ~B === ~A && B || ~A & ~B || A && ~B <-- I am skipping this last case with my current logic
            //~A
        if (selected !== null) {
            if (selected !== square){ //clicking on non-selected square
                if (this.squareisPossibleMove(square)) {//move will be executed
                    this.moveHandler(selected,square,this.state.history,this.state.whiteIsNext);

                } else { //selecting different squares behavior
                    //~A && B
                    if (current.position[square].type !== null && (current.position[square].color==="white")===whiteIsNext) {
                        this.setState({
                            selected: square
                        });
                    // ~A && ~B
                    } else {
                        this.setState({
                            selected: null
                        });
                    }    
                }   
            }
        }
    }
    

    render() {
        const history = this.state.history;
        const current = history[history.length - 1].position;
        const whiteIsNext=this.state.whiteIsNext;
        const nextColor = whiteIsNext ? "white": "black";
        const whiteCheck = history[history.length -1].check.white;
        const blackCheck = history[history.length -1].check.black;
        const mate = checkmateDetector(history[history.length -1],whiteIsNext);
        const currentState= history[history.length -1];
        return (
            <div className="game-container">
                
                <div className="board-container">
                    <h3> Black is in Check: {JSON.stringify(blackCheck)} </h3>
                    <h1> {JSON.stringify(nextColor)} is Mated: {JSON.stringify(mate)} </h1>
                    <div className="player-info">
                        <div className= "takenPieces"> takenWhitePieces </div>
                        <TurnIndicator
                        turn={!whiteIsNext ? "" : "yourTurn"}
                        value="Black's Turn"
                        colorOfIndicator="black-turn-indicator"
                        /> 
                    </div>
                    <div>
                       Promotion: {promotionLocator(currentState)}
                    </div>
                    <Board 
                        position= { current }
                        onClick = {square => this.handleClick(square)}
                        shade = { square => this.shade(square) }
                        whiteIsNext = { whiteIsNext }
                        currentState={currentState}
                    />

                    <h3> White is in Check: {JSON.stringify(whiteCheck)} </h3>
                    <div className="player-info">
                        <div className= "takenPieces"> takenBlackPieces </div>
                        <TurnIndicator
                            turn={!whiteIsNext ? "yourTurn" : ""}
                            value="White's Turn"
                            colorOfIndicator="white-turn-indicator"
                        />
                    </div>

                </div>

                <div className="history-container">
                                     {/* This should be a component*/}
                    <h2> History </h2>
                    <p>{JSON.stringify(currentState.enPassant)}</p>  
                    <ol>
                        <li>e4 e5</li>
                        <li>e5 e6</li>
                    </ol>
                </div>
            </div>
        )
    }
}