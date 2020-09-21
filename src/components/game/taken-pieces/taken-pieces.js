import React from 'react';
import './taken-pieces.css'

export default class TakenPieces extends React.Component{
    renderPiece(piece){
        return (
            <li key={piece.id}>
                <img src={piece.img} alt=""/>
            </li>
        )
    }

    render(){
        return(
            <ul className={"taken-pieces"}>
                {this.props.takenPieces.map( piece => this.renderPiece(piece))}
            </ul>
        )
    }
}