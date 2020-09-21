import React from 'react';

export function squareToLetterNumber(square){
    return String.fromCharCode(97+square%8) + JSON.stringify(8 - (square - square%8)/8);
}

function HistoryRow(props) {
    return (
        <div className="history-row">
            <div className="history-entry">{props.firstEntry}</div>
            <div className="history-entry">{props.secondEntry}</div>
        </div>
    )
}




//history component will receive history prop from game
export class History extends React.Component {
    renderRow(index) {
        const firstHistoryEntry =this.props.completeHistory[2*index];
        const firstEntryNumber = firstHistoryEntry[2];
        const firstEntryBoardNumber = squareToLetterNumber(firstEntryNumber);
        const firstEntryLetter = 
        firstHistoryEntry[0]!=="whitePawn"
        ? firstHistoryEntry[0] === "knight"
        ? "N"
        : firstHistoryEntry[0].toUpperCase()[0]
        : "";
        const firstEntry = firstEntryLetter+firstEntryBoardNumber;

        let secondEntry = null;
        const secondHistoryEntry = this.props.completeHistory[2*index+1];
        if (secondHistoryEntry) {
            const secondEntryNumber = secondHistoryEntry[2];
            const secondEntryBoardNumber = squareToLetterNumber(secondEntryNumber);
            const secondEntryLetter = 
            secondHistoryEntry[0]!=="blackPawn"
            ? secondHistoryEntry[0] === "knight"
            ? "N"
            : secondHistoryEntry[0].toUpperCase()[0]
            : "";
            secondEntry = secondEntryLetter+secondEntryBoardNumber
        }
        return (
            <li key = {index}>
                <HistoryRow
                    firstEntry = {firstEntry}
                    secondEntry = {secondEntry}
                />
            </li>
        )
    }

    render() {
        const history = this.props.completeHistory;
        const numberOfRows = 
        history.length===0 ? 0 : (history.length - 1 - (history.length - 1)%2)/2+1;

        return (
            <div className="history-container">
                <h1> History </h1>
                <ol>
                    {Array(numberOfRows).fill(null)
                    .map( (elment,index) => this.renderRow(index))
                    }  
                </ol>
            </div>
        )
    }

}