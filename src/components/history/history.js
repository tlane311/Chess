import React from 'react';

export function squareToLetterNumber(square){
    return String.fromCharCode(97+square%8) + JSON.stringify(8 - (square - square%8)/8);
}


export class History extends React.Component {

}
// asdkahsdjmahf everything here doesn't matter

/* HTML
<h3>History</h3>

<ol>
    <li>
        <div className="history-row">
            <div></div>

            <div></div>
        </div>
    </li>
    <li> </li>
    <li> </li>
    <li> </li>
</ol>




*/