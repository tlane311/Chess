import React from 'react';
import { Promoter, promotionLocator } from '../promoter/promoter.js'

export function Square(props) {
    return (
        <div className={"square"+" "} id={props.shade} onClick={props.onClick}>
            <img src={props.value} alt=""/>
            {props.promoter}
        </div>
    );
}

export class Board extends React.Component {
    
    containsPromoter(number,state){
        if (number === promotionLocator(state)) {
        return (
            <Promoter
                promotionDisplayed = "show-promoter"
                promotionColor = {number > 55 ? "white" : "black"}
            />
        )}
    }


    
    renderSquare(number){
        return (
            <div><Square
                shade={this.props.shade(number)}
                value={ this.containsPromoter(number, this.props.currentState) ? "" : this.props.position[number].img }
                onClick={ () => this.props.onClick(number) }
                promoter= {this.containsPromoter(number, this.props.currentState)}
            />
            </div>
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