import React from 'react';

export function TurnIndicator(props) {
    return (
        <div className={"turn-indicator " + props.colorOfIndicator} id={props.turn}>
            {props.value}            
        </div>
    )
}