/*jslint es6 */

import React from 'react';
//import ReactDOM from 'react-dom';
import './board.css';
import { firstPosition } from './pieces/pieces.js';
import { movesLogic, checkDetector } from './pieces/pieceslogic.js'



function Square(props) {
    return (
        <div className={"square"+" "} id={props.shade} onClick={props.onClick}>
            <img src={props.value} alt=""/>
        </div>
    );
}

function TurnIndicator(props) {
    return (
        <div className={"turn-indicator " + props.colorOfIndicator} id={props.turn}>
            {props.value}
        </div>
    )
}


class Board extends React.Component {
    renderSquare(number){
        return (
            <Square
                shade={this.props.shade(number)}
                value={this.props.position[number].img} //what is happening with null squares here? Answer: I used type as key in my null squares
                onClick={ () => this.props.onClick(number) }
            />
        );
    }
    renderRow(number){
        return (
            <div className="board-row">
                {[0,1,2,3,4,5,6,7]
                .map( item => (
                    this.renderSquare(item+number)
                ))}
            </div>
        )
    }
    
    render() {
        return (
            <div>
                {[0,8,16,24,32,40,48,56]
                .map( item => (
                    this.renderRow(item)
                ))}

            </div>
        )
    }
}


const moveHelper = { //this is supposed to help tidy up the extra props of state
    whitePawn: function (selection, nextSquare, state) {
        //add en passant status 
        if (selection - nextSquare=== 16){
            state.enPassant[state.position[nextSquare].id]="true";
        }
        //remove taken pawn
        if (selection - 9 ===  nextSquare || selection - 7 === nextSquare) {
            state.position[nextSquare + 8] = {type: null};
        }

        //promotion helper

    },
    blackPawn: function (selection, nextSquare, state) {
        //add en passant status 
        if (selection - nextSquare=== -16){
            state.enPassant[state.position[nextSquare].id]="true";
        }
        //remove taken pawn
        if (selection + 9 ===  nextSquare || selection + 7 === nextSquare) {
            state.position[nextSquare - 8] = {type: null};
        }

        //promotion helper
        
    },
    knight: function (selection, nextSquare, state) {},
    bishop: function (selection, nextSquare, state) {},
    rook: function (selection, nextSquare, state) {
        //castling
    },
    queen: function (selection, nextSquare, state) {},
    king: function (selection, nextSquare, state) {
        const castling= false;
        const castlingSide = true ? "king" : "queen";
        //alter castling status
            //case1: castle occured
            //case2: king moved prematurely
            //case3: rook moved prematurely

        //move rook after castle occurs
    },
}







function checkHelper(state, whiteIsNext) {
    const color = whiteIsNext ? "black" : "white"; 
    if (checkDetector(state,whiteIsNext)) {
        state.check[color]=true;
    } else {
        state.check[color]=false;
    }
}





















function checkmate (state) {
    return null;
}














export class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [firstPosition],
            selected: null,
            whiteIsNext: true 
        };
    }

    possibleMoves(selected, state){ //returns array of moves
        if (selected !==null){ //conditional to avoid position[null].type which throws error
            
            if (state.position[selected].type){ //nonempty square selected
                return movesLogic[state.position[selected].type](selected,state)
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
        
        return Boolean(
            this.possibleMoves(selected, history[history.length -1] )
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
        'use strict';
        const oldHistory = JSON.parse(JSON.stringify(history));
        const freshHistory = JSON.parse(JSON.stringify(history)); //need multiple history because js keeps live references to subobjects
        const current = freshHistory[history.length - 1];
    
        let nextPosition = current.position.slice();
        let next=current; //redundant code but should make this bit more readable
        const nextSquareIsOccupied = Boolean(nextPosition[nextSquare].type);
    
        if (nextSquareIsOccupied){
            whiteIsNext ? next.takenBlackPieces.push(current.position[nextSquare]) : next.takenWhitePieces.push(current.position[nextSquare]);
        }
    
        const castling= false;
        const castlingSide = true ? "king" : "queen";
    
        if (!castling) {
            nextPosition[nextSquare]=nextPosition[selection];
            nextPosition[selection]={type: null};
        } else {
            nextPosition[nextSquare]=nextPosition[selection];
            nextPosition[selection]={type: null};
        }
    
    
        next.position=nextPosition;
        next.enPassant={};
    
        //moveHelper at the end to clear up statuses

        moveHelper[nextPosition[nextSquare].type](selection,nextSquare,next);
        checkHelper(next,whiteIsNext);

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
        
        return (
            <div className="game-container">
                <div className="board-container">

                    <div className="player-info">
                        <div className= "takenPieces"> takenWhitePieces </div>
                        <TurnIndicator
                        turn={!whiteIsNext ? "" : "yourTurn"}
                        value="Black's Turn"
                        colorOfIndicator="black-turn-indicator"
                        /> 
                    </div>
                    
                    <Board 
                        position= { current }
                        onClick = {square => this.handleClick(square)}
                        shade = { square => this.shade(square) }
                        whiteIsNext = { whiteIsNext }
                    />
                    
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
                    <ol>
                        <li>e4 e5</li>
                        <li>e5 e6</li>
                    </ol>
                </div>
            </div>
        )
    }
}