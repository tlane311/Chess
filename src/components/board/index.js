import React from 'react';
//import ReactDOM from 'react-dom';
import './board.css';
import { firstPosition } from './pieces/pieces.js';


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
                value={this.props.position[number].type,number} //what is happening with null squares here?
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
            selected: null
        };
    }

    shade(number){
        if (number !== this.state.selected){
            let shade = (number%2===0 && number%16 <=7) || (number%2!==0 && number%16 >7) ? "light" : "dark";
            return shade
        } else {
            return "selected"
        }
        
    }

    possibleMoves(selection, position){
        //retrieve selected
        //if piece is not null
            //calculate possible moves based on type
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