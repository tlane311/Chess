import React from 'react';
import { Promoter } from '../promoter/promoter.js'

export function Square(props) {
    const displayPiece = props.value 
        ? (<img src={props.value} alt=""/>)
        : null;
    return (
        <div className={"square"+" "} id={props.shade} onClick={props.onClick} key={`square-${props.uniqueKey}`}>
            {displayPiece}
            {props.promoter}
        </div>
    );
}

export class Board extends React.Component {
    
    containsPromoter(number,promotionLocation){
        if (number === promotionLocation) {
            return (
                <Promoter
                    promotionDisplayed = "show-promoter"
                    promotionColor = {number > 55 ? "black" : "white"}
                    onClick ={ (obj) => {this.props.onClick(obj)} }
                    playerColor = {this.props.playerColor}
                />
        )} else {
            return null;
        }
    }
    
    renderSquare(number){
        return (
            <div>
                <Square
                    shade={this.props.shade(number)}
                    value={ this.containsPromoter(number, this.props.promotionLocation) 
                    ? "" : this.props.position[number].img}
                    onClick={ () => this.props.onClick(number) }
                    promoter= {this.containsPromoter(number,this.props.promotionLocation)}
                    uniqueKey={number}
                />
            </div>
        );
    }

    renderRow(number){
        return (
            <div className={"board-row "} key={`row-${number}`}>
                {[0,1,2,3,4,5,6,7]
                .map( item => (
                    this.renderSquare(item+number)
                ))}
            </div>
        )
    }
    
    render() {
        return (
            <div className={"board "+this.props.boardOrientation} key={'board'}>
                {[0,8,16,24,32,40,48,56]
                .map( item => (
                    this.renderRow(item)
                ))}
            </div>
        )
    }
}