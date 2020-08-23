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
        };
    }

    possibleMoves(position,selected){ //true returns array of locations else returns false
        if (selected !==null){
            if (position[selected].type){
                return movesLogic[position[selected].type](selected)
            } else {
                return []
            }
        } else {
            return []
        }
    }

    numberisPossibleMove(number) {  //supposed to detect if a given number is a possible move from selected
        const history = JSON.parse(JSON.stringify(this.state.history));
        return Boolean(
            this.possibleMoves(history[history.length -1].position,this.state.selected)
            .filter(element => element === number)
            .length);
    }

    shade(number){
        const history = JSON.parse(JSON.stringify(this.state.history));
        let numberIsPossibleMove = this.numberisPossibleMove(number)
        if (number===this.state.selected  && history[history.length -1].position[number].type){
            return "selected"
        } else if (numberIsPossibleMove) {
            return "possibleMove"
        } else {
            return (number%2===0 && number%16 <=7) || (number%2!==0 && number%16 >7) ? "light" : "dark";
        }
    }

    selectClick(number) {
        // if selected !== null & number is a possible move
            // execute move
            // i.e. firstPosition.position needs to update
        const oldhistory = JSON.parse(JSON.stringify(this.state.history));
        const history = JSON.parse(JSON.stringify(this.state.history));
        const current = history[history.length - 1];

        if (this.state.selected !== number){
            if (this.numberisPossibleMove(number)) {
                let nextPosition = current.position.slice();
                nextPosition[number]=nextPosition[this.state.selected];
                nextPosition[this.state.selected]={type: null};
                let next=current;
                next.position=nextPosition;
                this.setState({
                    history: oldhistory.concat(next),
                    selected: null
                })
            } else {
                this.setState({
                    selected: number
                });

            }
        } else {
            this.setState({
                selected: null
            });
        }
    }

    

    render() {
        const history = this.state.history;
        const current = history[history.length - 1].position;
        return (
            <div>
                <Board 
                position={current}
                onClick = {number => this.selectClick(number)}
                shade = { number => this.shade(number) }
                />
            </div>
        )
    }
}