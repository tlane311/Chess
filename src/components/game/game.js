import React from 'react';
import './game.css';
import { firstPosition, piecesCompareFunction } from './pieces/pieces.js';
import { movesLogic } from './pieces/pieceslogic.js';
import { checkFilter, checkmateDetector, drawDetector } from './pieces/checklogic.js';
import { TurnIndicator } from './turnindicator/turnindicator.js';
import { Board } from './board/board.js';
import { moveHelper, checkHelper, stateHelper} from './gamehelpers.js';
import { History } from './history/history.js';
import { Undo, Redo, undoLastMove } from './history/navigation/undo.js'
import { socketIsListening, socket } from '../../socketIsListening.js';
import { imgHandler } from './pieces/imgHandler.js';
import PostGame from '../post-game/post-game.js'
import PostGameMenu from '../post-game/post-game-menu.js'
import TakenPieces from './taken-pieces/taken-pieces.js'
export class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            gameType: "local",
            playerColorIsWhite: true,
            constellation: firstPosition,
            history: [],
            historySelector: 0,
            selected: null,
            whiteIsNext: true,
            promotionStatus: false,
            promotionLocation: null,
            postGame: false,
            otherPlayerHasLeft: false,
            gameResult: null,
        };
        socketIsListening.bind(this)();
    }

    possibleMoves(selected){ //returns array of moves
        const constellation = this.state.constellation;
        const whiteIsNext = this.state.whiteIsNext;

        if (selected !==null){ //conditional to avoid constellation.position[null].type which throws error
            const currentPiece = constellation.position[selected].type;

            if (constellation.position[selected].type){ //nonempty square selected
                return checkFilter(movesLogic[currentPiece](selected,constellation), selected, constellation, whiteIsNext)
            } else { //empty square selected
                return []
            }

        } else { //selected===null
            return []
        }
    }

    squareIsPossibleMove(square) {  //returns boolean describing if a given square is a possible move from selected
        const selected = this.state.selected;
        return Boolean(
            this.possibleMoves(selected)
            .filter(element => element === square)
            .length);
    }

    shade(square){//adds a css id to each square that decides shade
        const constellation = this.state.constellation;
        let squareIsPossibleMove = this.squareIsPossibleMove(square)

        if (square===this.state.selected  && constellation.position[square].type){
            //if square is selected and square is not empty
            return "selected"
        } else if (squareIsPossibleMove) {
            return "possible-move-" + ((square%2===0 && square%16 <=7) || (square%2!==0 && square%16 >7) ? "light" : "dark");
        } else {
            //standard shading for chess board describing using modulo conditionals
            return (square%2===0 && square%16 <=7) || (square%2!==0 && square%16 >7) ? "light" : "dark";
        }
    }
    squareIsPromotion = (square) => square.id==="promoted";

    moveHandler(selection, nextSquare, promotionType=null){
        const oldHistory = JSON.parse(JSON.stringify(this.state.history));
        const historySelector = this.state.historySelector;
        const whiteIsNext = this.state.whiteIsNext;
        const promotionLocation = this.state.promotionLocation;
      
        const currentConstellation = JSON.parse(JSON.stringify(this.state.constellation)); //copy
        const currentPosition = JSON.parse(JSON.stringify(currentConstellation.position)); //copy
      
        let nextConstellation=currentConstellation; //this is just a pointer to currentConstellation which we will mutate
        let nextPosition=currentConstellation.position; 
      
        //adding pieces that are taken by this move to the constellation
        const nextSquareIsOccupied = Boolean(currentPosition[nextSquare].type);
        if (nextSquareIsOccupied){
            whiteIsNext
                ? nextConstellation.takenBlackPieces.push([currentPosition[nextSquare],historySelector])
                : nextConstellation.takenWhitePieces.push([currentPosition[nextSquare],historySelector]);
        }
        //resetting enPassant
        nextConstellation.enPassant={};
      
        //we break move handling into 3 cases:
        //condition 1: regular move (including en passant and castling) not promoting
        //condition 2: if a pawn is attempting to promote, change constellation so that promotionHelper displays
        //condition 3: handles turning a pawn into its promotion
        //note about the logic: A || (!A && !B) || (!A && B) === A || !A === true
        //note, we modify the history in a weird way so that the redo button can use moveHandler without messing up the history
          //the alternative is that the redo button creates its own move handling which seems wet
      
        const aboutToPromote = //detecting if we are attempting to move a pawn to promote
        ((nextPosition[selection].type==="whitePawn"  && nextSquare < 8)
        || (nextPosition[selection].type==="blackPawn" && nextSquare > 55));
      
        if (!this.state.promotionStatus && !aboutToPromote){ //condition 1
            //if enPassant, then we will add taken pawn to the takenPieces
            const attemptingEnPassant = (currentPosition[selection].type === "whitePawn" || currentPosition[selection].type === "blackPawn")
                && ((selection - 9 ===  nextSquare || selection - 7 === nextSquare)||(selection + 9 ===  nextSquare || selection + 7 === nextSquare) )
                && !nextConstellation.position[nextSquare].type;
            
            if (attemptingEnPassant){
                whiteIsNext
                    ? nextConstellation.takenBlackPieces.push([currentPosition[nextSquare+8],historySelector])
                    : nextConstellation.takenWhitePieces.push([currentPosition[nextSquare-8],historySelector]);
            }
            
            moveHelper[currentPosition[selection].type](selection, nextSquare, nextConstellation);
        
            checkHelper(nextConstellation, whiteIsNext);
        
            stateHelper[nextPosition[nextSquare].type](selection,nextSquare,nextConstellation);
            
            /* 
            example:
            history length is 2

            historySelector is 0
            */
           
            let newHistory;
            if (historySelector < oldHistory.length) {
                if (oldHistory[historySelector][1]===selection && oldHistory[historySelector][2]===nextSquare){                    
                    newHistory = oldHistory
                } else {
                    newHistory = oldHistory.slice(0,historySelector).concat([[nextPosition[nextSquare].type,selection,nextSquare,nextConstellation.castleStatus]])
                }
            } else {
                newHistory = oldHistory.concat([[nextPosition[nextSquare].type,selection,nextSquare, nextConstellation.castleStatus]])
            }
        
            return new Promise( (resolve) => this.setState({
                history: newHistory,
                historySelector: historySelector+1,
                constellation: nextConstellation,
                selected: null,
                whiteIsNext: !whiteIsNext
            }, resolve)
            );
        }
      
        if (!this.state.promotionStatus && aboutToPromote){ //condition 2
            this.setState({
                promotionStatus: true,
                promotionLocation: nextSquare,
                selected: selection //this needs to be forced here for redo feature
            });
        }
      
        if (this.state.promotionStatus){ //condition 3
            const currentColor = whiteIsNext ? 'white': 'black';
            //adding pawn to taken Pieces
            whiteIsNext
                ? nextConstellation.takenWhitePieces.push([currentPosition[selection],historySelector])
                : nextConstellation.takenBlackPieces.push([currentPosition[selection],historySelector]);

            
            //moving pieces
            nextPosition[nextSquare] = {
                type: promotionType,
                id: "promoted",
                color: currentColor,
                img: imgHandler(currentColor,promotionType)
            };
            nextPosition[selection] = {type: null};
        
            checkHelper(nextConstellation, whiteIsNext);
        
            let newHistory;
            if (historySelector < oldHistory.length) {
                if (oldHistory[historySelector][1]===selection && oldHistory[historySelector][2]===nextSquare && oldHistory[historySelector][0]===nextPosition[nextSquare].type){    
                    newHistory = oldHistory
                } else {
                    newHistory = oldHistory.slice(0,historySelector).concat([[nextPosition[nextSquare].type,selection,promotionLocation,nextConstellation.castleStatus]])
                }
            } else {
                newHistory = oldHistory.concat([[nextPosition[nextSquare].type,selection,promotionLocation,nextConstellation.castleStatus]])
            }
        
            return new Promise( (resolve) => this.setState({
                history: newHistory,
                historySelector: historySelector+1,
                constellation: nextConstellation,
                selected: null,
                whiteIsNext: !whiteIsNext,
                promotionLocation: null,
                promotionStatus: false
            }, resolve)
            );
        }
    }
        
    async handleClick(square) {
        const currentConstellation = JSON.parse(JSON.stringify(this.state.constellation));
        const currentPosition = currentConstellation.position;
        const selected = this.state.selected;
        const whiteIsNext = this.state.whiteIsNext;
        const promotionLocation = this.state.promotionLocation
        if ((this.state.gameType === "online" && this.state.playerColorIsWhite===whiteIsNext) || this.state.gameType==="local") {
            //nothing selected, selecting piece of correct color
            if (selected===null && currentPosition[square].type !== null && (currentPosition[square].color==="white")===whiteIsNext) {
                this.setState({
                    selected: square
                });
            }
            //something is selected
            if (selected !== null) {
                if (selected !== square){ //clicking on non-selected square
                    if (this.squareIsPromotion(square)){
                        await this.moveHandler(selected,promotionLocation,square.type);
                        const history = this.state.history; //history has been updated from moveHandler
                        if (this.state.gameType==="online") socket.emit('submit-move', history[history.length - 1]);
                        if (checkmateDetector(this.state.constellation,this.state.whiteIsNext)) {
                            this.setState({
                                postGame: true,
                                gameResult: this.state.whiteIsNext ? "White Wins!" : "Black Wins!"
                            })
                            socket.emit('checkmate', this.state.whiteIsNext ? "white" : "black");
                        }
                        if (drawDetector(this.state.constellation,this.state.whiteIsNext)) {
                            this.setState({
                                postGame: true,
                                gameResult: "Draw!"
                            })
                            socket.emit('draw', this.state.whiteIsNext ? "white" : "black");
                        }

                    } else if (this.squareIsPossibleMove(square) && square !== promotionLocation) {//move will be executed
                        await this.moveHandler(selected,square);
                        const history = this.state.history; //history has been updated from moveHandler
                        if (this.state.gameType==="online" && !this.state.promotionStatus) socket.emit('submit-move', history[history.length - 1]);
                        if (checkmateDetector(this.state.constellation,this.state.whiteIsNext)) {
                            this.setState({
                                postGame: true,
                                gameResult: this.state.whiteIsNext ? "White Wins!" : "Black Wins!"
                            })
                            socket.emit('checkmate', this.state.whiteIsNext ? "white" : "black");
                        }
                        if (drawDetector(this.state.constellation,this.state.whiteIsNext)) {
                            this.setState({
                                postGame: true,
                                gameResult: "Draw!"
                            })
                            socket.emit('draw', this.state.whiteIsNext ? "white" : "black");
                        }
                    } else { //clicking on a not possible move square
                        if (this.state.promotionStatus) {
                            this.setState({
                                promotionStatus: false,
                                promotionLocation: null,
                            });
                        }
                        if (currentPosition[square].type !== null && (currentPosition[square].color==="white")===whiteIsNext) { //selecting different piece
                            this.setState({
                                selected: square
                            });
                        } else { //clicking neutral square will clear selected
                            this.setState({
                                selected: null
                            });
                        }
                    }
                }
            }
        }
    }

    //post-game methods
    handleEscape(){
        if (!this.state.otherPlayerHasLeft) { socket.emit('close-room'); }
        this.setState({
            postGame: false
        });
        socket.close();
    }

    //navigation
    handleUndo() {
        const constellation = JSON.parse(JSON.stringify(this.state.constellation));
        const history = JSON.parse(JSON.stringify(this.state.history));
        const historySelector = this.state.historySelector;
        const whiteIsNext = this.state.whiteIsNext;
        if (historySelector){
            this.setState({
                constellation: undoLastMove(historySelector, history, constellation),
                historySelector: historySelector-1,
                whiteIsNext: !whiteIsNext,
                promotionStatus:false,
                promotionLocation: null,
                selected: null
            });
        }
    }

    handleRedo(){
        const history = JSON.parse(JSON.stringify(this.state.history));
        const historySelector = this.state.historySelector;
        const nextMove = historySelector < history.length
            ? history[historySelector] 
            : null;
        if (nextMove){
            this.moveHandler(nextMove[1],nextMove[2], nextMove[0])
        }
    }


    render() {
        const history = this.state.history;
        const currentConstellation = this.state.constellation;
        const currentPosition = currentConstellation.position;
        const whiteIsNext = this.state.whiteIsNext;
        const promotionLocation = this.state.promotionLocation;
        const gameResult = this.state.gameResult;
        const historySelector =this.state.historySelector;

        const postGameModal = this.state.postGame 
        ? (
            <PostGame>
                <div className="modal">
                    <PostGameMenu
                        result ={gameResult}
                        escape ={() => this.handleEscape()}
                    />
                </div>
            </PostGame>
        ) 
        : null ;

        const takenWhitePieces = JSON.parse(JSON.stringify(
            this.state.constellation.takenWhitePieces
            .map(element => element[0])
            .sort((first,second)=> piecesCompareFunction(first.type, second.type))
            ));
        const takenBlackPieces = JSON.parse(JSON.stringify(
            this.state.constellation.takenBlackPieces
            .map(element => element[0])
            .sort((first,second)=> piecesCompareFunction(first.type, second.type))
            ))
        return (
            <div className="game-container">
                {postGameModal}
                <Undo 
                    onClick = {() => this.handleUndo()}
                />
                <Redo
                    onClick = {() => this.handleRedo()}
                />
                <div className="board-container"> 
                    <div className="player-info">                        
                        <TakenPieces
                            color="black"
                            takenPieces={takenBlackPieces}
                        />
                        <TurnIndicator
                            turn = {!whiteIsNext ? "" : "yourTurn"}
                            value = "Black's Turn"
                            colorOfIndicator = "black-turn-indicator"
                        /> 
                    </div>
                    <Board 
                        position= { currentPosition }
                        onClick = {square => {
                            this.handleClick(square);
                            }}
                        shade = { square => this.shade(square) }
                        whiteIsNext = { whiteIsNext }
                        currentState={currentConstellation}
                        promotionLocation={ promotionLocation }
                        playerColor= {this.state.playerColorIsWhite? "light-player": "dark-player"}
                    />
                    <div className="player-info">
                        <TakenPieces
                            color="white"
                            takenPieces={takenWhitePieces}
                        /> 
                        <TurnIndicator
                            turn={!whiteIsNext ? "yourTurn" : ""}
                            value="White's Turn"
                            colorOfIndicator="white-turn-indicator"
                        />
                    </div>
                </div>
                <History
                    completeHistory = { history }
                />
            </div>
        )
    }
}