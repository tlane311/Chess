/*jslint es6 */

import React from 'react';
import './board.css';
import { firstPosition } from './pieces/pieces.js';
import { movesLogic } from './pieces/pieceslogic.js'
import { checkFilter, checkmateDetector } from './pieces/checklogic.js'
import { TurnIndicator } from './turnindicator/turnindicator.js';
import { Board } from './board/board.js';
import { moveHelper, checkHelper, stateHelper} from './gamehelpers.js'




export class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [firstPosition],
            selected: null,
            whiteIsNext: true,
            promotionStatus: false,
            promotionLocation: null
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

    squareIsPossibleMove(square) {  //returns boolean describing if a given square is a possible move from selected
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
        let squareIsPossibleMove = this.squareIsPossibleMove(square)
        
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

    promotionHandler(selection,nextSquare,history,whiteIsNext,promotionLocation){

        const oldHistory = JSON.parse(JSON.stringify(history));
        const freshHistory = JSON.parse(JSON.stringify(history)); //need multiple history because js keeps live references to subobjects
        const currentState = freshHistory[history.length - 1];

        let currentPosition = currentState.position.slice(); //copy
        let next=currentState; //redundant code but should make this bit more readable
        let nextPosition=currentState.position;
        const nextSquareIsOccupied = Boolean(currentPosition[promotionLocation].type);
        if (nextSquareIsOccupied){
            whiteIsNext
            ? next.takenBlackPieces.push(currentPosition[nextSquare])
            : next.takenWhitePieces.push(currentPosition[nextSquare]);
        }
        //moving pieces
        nextPosition[selection]={type: null};
        nextPosition[promotionLocation]=nextSquare;
        console.log("don't call me twice")


        checkHelper(next, whiteIsNext)

        this.setState({
            history: oldHistory.concat(next),
            selected: null,
            whiteIsNext: !whiteIsNext,
            promotionLocation: null,
            promotionStatus: false
        });

    }

    moveHandler(selection, nextSquare, history, whiteIsNext,promotionLocation) {
        const oldHistory = JSON.parse(JSON.stringify(history));
        const freshHistory = JSON.parse(JSON.stringify(history)); //need multiple history because js keeps live references to subobjects
        const currentState = freshHistory[history.length - 1];

        let currentPosition = currentState.position.slice(); //copy
        let next=currentState; //redundant code but should make this bit more readable
        let nextPosition=currentState.position;

        if (promotionLocation !== null){
            this.promotionHandler(selection,nextSquare,history,whiteIsNext,promotionLocation)
        } else {
            const nextSquareIsOccupied = Boolean(currentPosition[nextSquare].type);
            if (nextSquareIsOccupied){
                whiteIsNext
                ? next.takenBlackPieces.push(currentPosition[nextSquare])
                : next.takenWhitePieces.push(currentPosition[nextSquare]);
            }

            next.enPassant={};

            const promotionDetection = 
            (nextPosition[selection].type==="whitePawn" && nextSquare < 8) 
            || (nextPosition[selection].type==="blackPawn" && nextSquare > 55)

            if (!promotionDetection) {
                moveHelper[currentPosition[selection].type](selection, nextSquare, next) //modifies next by moving pieces
                //updates takenPieces

                checkHelper(next, whiteIsNext)

                stateHelper[nextPosition[nextSquare].type](selection,nextSquare,next)

                //every key of next should be updated at this point
                this.setState({
                    history: oldHistory.concat(next),
                    selected: null,
                    whiteIsNext: !whiteIsNext
                });
            } else {
                
                this.setState({
                    promotionStatus: true,
                    promotionLocation: nextSquare,
                });

            }
        }

    }


    squareIsPromotion(square) {
        return square.id==="promoted";
    }

    handleClick(square) {
        console.log("how many times am I called?")
        const oldhistory = JSON.parse(JSON.stringify(this.state.history));
        const history = JSON.parse(JSON.stringify(this.state.history)); //need new history because js keeps live references to subobjects
        const current = history[history.length - 1];
        const selected = this.state.selected;
        const whiteIsNext = this.state.whiteIsNext;
        //nothing selected, selecting piece of correct color
        if (selected===null && current.position[square].type !== null && (current.position[square].color==="white")===whiteIsNext) {
            this.setState({
                selected: square
            });
        }
        //something is selected
        if (selected !== null) {
            if (selected !== square){ //clicking on non-selected square
                if (this.squareIsPromotion(square)){
                    this.moveHandler(selected,square,this.state.history,this.state.whiteIsNext,this.state.promotionLocation);
                    console.log("promotion square handled")
                } else if (this.squareIsPossibleMove(square) && square !== this.state.promotionLocation) {//move will be executed
                    this.moveHandler(selected,square,this.state.history,this.state.whiteIsNext,this.state.promotionLocation);
                    console.log("regular square handled")
                } else { //clicking on a not possible move square
                    if (this.state.promotionStatus) {
                        this.setState({
                            promotionStatus: false,
                            promotionLocation: null,
                        });
                    }
                    if (current.position[square].type !== null && (current.position[square].color==="white")===whiteIsNext) { //selecting different piece
                        this.setState({
                            selected: square
                        });
                    } else { //clicking neutral square will clear selected
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
        const promotionStatus = this.state.promotionStatus;
        const promotionLocation = this.state.promotionLocation;
        const selected = this.state.selected;
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
                    <Board 
                        position= { current }
                        onClick = {square => {
                            this.handleClick(square);
                            console.log('props being called')
                            }}
                        shade = { square => this.shade(square) }
                        whiteIsNext = { whiteIsNext }
                        currentState={currentState}
                        promotionStatus={ promotionStatus }
                        promotionLocation={ promotionLocation }
                        promotionClick = {type => {alert(type.id)}}
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
                    <p>PromotionLocation: {JSON.stringify(current[promotionLocation])}</p>  
                    <p>Selected: {JSON.stringify(selected)}</p>  
                    <ol>
                        <li>e4 e5</li>
                        <li>e5 e6</li>
                    </ol>
                </div>
            </div>
        )
    }
}