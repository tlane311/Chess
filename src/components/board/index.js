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
                value={this.props.position[number].type} //what is happening with null squares here?
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
        if (selected){
            if (position[selected].type){
                return movesLogic[position[selected].type](selected)
            } else {
                return []
            }
        } else {
            return []
        }
    }

    shade(number){
        let numberIsPossibleMove = Boolean(
            this.possibleMoves(this.state.history[0].position,this.state.selected)
            .filter(element => element === number)
            .length);
        if (number===this.state.selected  && this.state.history[0].position[number].type){
            return "selected"
        } else if (numberIsPossibleMove) {
            return "possibleMove"
        } else {
            return (number%2===0 && number%16 <=7) || (number%2!==0 && number%16 >7) ? "light" : "dark";
        }
    }

    selectClick(number) {
        if (this.state.selected !== number){
            this.setState({
                history:[firstPosition],
                selected: number
            });
        } else {
            this.setState({
                history:[firstPosition],
                selected: null
            });
        }
    }

    

    render() {
        const history = this.state.history;
        const current = history[0].position;
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