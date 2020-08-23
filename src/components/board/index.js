/*jslint es6 */

import React from 'react';
//import ReactDOM from 'react-dom';
import './board.css';
import { firstPosition } from './pieces/pieces.js';
import { movesLogic } from './pieces/pieceslogic.js'

function Square(props) {
    return (
        <div className="square" id={props.shade} onClick={props.onClick}>
            {props.value}
        </div>
    );
}
 
class Board extends React.Component {
    renderSquare(number){
        return (
            <Square
                shade={this.props.shade(number)}
                value={this.props.position[number].type} //what is happening with null squares here? Answer: I used type as key in my null squares
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



export class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [firstPosition],
            selected: null,
            whiteIsNext: true 
        };
    }

    possibleMoves(position,selected){ //returns array of moves
        if (selected !==null){ //conditional to avoid position[null].type which throws error
            
            if (position[selected].type){ //nonempty square selected
                return movesLogic[position[selected].type](selected)
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
            this.possibleMoves( history[history.length -1].position, selected )
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
                    
                    let nextPosition = current.position.slice();
                    let next=current;
                    
                    nextPosition[square]=nextPosition[this.state.selected];
                    nextPosition[this.state.selected]={type: null};
                    next.position=nextPosition;
                    
                    this.setState({
                        history: oldhistory.concat(next),
                        selected: null,
                        whiteIsNext: !whiteIsNext
                    });
                    
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

    //if select===null && current.position[square].type !==null && current.position[square].color==="white"
        //select=square
    //if select!==null
        //clicking on non-selected square
            //possibleMove
            //notPossibleMove
                //anotherPiece ? select = square: select = null
    

    render() {
        const history = this.state.history;
        const current = history[history.length - 1].position;
        return (
            <div>
                <Board 
                position= { current }
                onClick = {square => this.handleClick(square)}
                shade = { square => this.shade(square) }
                />
            </div>
        )
    }
}