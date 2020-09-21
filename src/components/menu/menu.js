import React from 'react';
import { socket, menuIsListening } from '../../socketIsListening'
import './menu.css';





export class Menu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            inQueue: false,
            localGame: false,
            inGame: false, //decides when menu switches to in-game menu
            inGameShown: false,
            playerIsLight: null, 
            //player color is stored in state since we might need to pass it to server if the player surrenders or asks for draws
            //note, the menu does not talk directly to game
            drawRequested: false,
            drawRequestSent: false,
            drawDeclined: false,
        }
        menuIsListening.bind(this)();
    }

    queueClick() { 
        if (this.state.inQueue) {
            //warn user they are in queue
            console.log('you are already in queue')
        } else {
            socket.open().emit('queue');
            this.setState({
                inQueue: true
            });
        }
    }

    localClick(){     
        if (this.state.inQueue) {
            socket.emit('abandon-queue').close();
            }
        this.setState({
            localGame: true,
            inQueue: false
        });
    }

    expandClick(){
        const inGameShown = this.state.inGameShown;
        this.setState({
            inGameShown: !inGameShown
        })
    }

    surrenderClick(){
        const playerIsLight = this.state.playerIsLight;
        const color = playerIsLight ? "white" : "black";
        socket.emit('surrender', color)
    }
    handleDrawRequest(){
        if (this.state.drawDeclined) return null;
        const playerIsLight = this.state.playerIsLight;
        const color = playerIsLight ? "white" : "black";
        socket.emit('draw-request', color);
        this.setState({
            drawRequestSent: true
        })
    }
    handleDrawReply(bool){
        const playerIsLight = this.state.playerIsLight;
        const color = playerIsLight ? "white" : "black";
        return (
            () => bool ? (
                socket.emit('draw', color))
            : (
                socket.emit('draw-declined'),
                this.setState({
                    drawRequested: false
                })
            )
        );
    }

    render(){
        const inGame = this.state.inGame;
        const inGameShown = this.state.inGameShown;
        const showGameButtons = inGameShown ? " " : " hide-display";
        const displayPlus = !inGameShown ? " " : " hide-display";
        const drawRequested = this.state.drawRequested;
        const sentDrawRequest = this.state.drawRequestSent ? "Requested": "Draw?"
        const drawDeclined = this.state.drawDeclined ? "Declined" : sentDrawRequest;
        //need some logic to shape menu when draw requested
        
        if (!inGame) {
            return(
                <nav className="menu-buttons">
                    <button className="dark-button" onClick = { () => this.localClick() }>
                        local play
                    </button>
                    <button className="background-button" onClick = { () => this.queueClick() }>
                        play online
                    </button>
                    <button className="settings-button" onClick = {() => {}}>
                        settings
                    </button>
                </nav>
            )
        } else if (!drawRequested) {
            return(
                <nav className="in-game-buttons">
                    <div className="game-buttons-container">
                        <h2>Playing With:</h2>
                        <h2> Guest </h2>
                        
                        <div className={"game-buttons" + showGameButtons}>
                            <button className="dark-button" onClick = {() => this.surrenderClick()}>
                                surrender
                            </button>
                            <button className="background-button" onClick = {() => this.handleDrawRequest()}>
                                {drawDeclined}
                            </button>
                        </div>

                        <div className="expand-collapse-button" onClick={ () => this.expandClick() }>
                            <div id="vertical-div" className={displayPlus}></div>
                            <div id="horizontal-div"></div>
                        </div>
                    </div>
                    
                    <button className="settings-button" onClick = {() => {}}>
                        settings
                    </button>
                </nav>
            )
        } else {
            return(
                <nav className="in-game-buttons">
                    <div className="game-buttons-container">
                        <h2>Draw Request From:</h2>
                        <h2> Guest </h2>
                        
                        <div className={"game-buttons" + showGameButtons}>
                            <button className="dark-button" onClick = {this.handleDrawReply(true)}>
                                accept
                            </button>
                            <button className="background-button" onClick = {this.handleDrawReply(false)}>
                                decline
                            </button>
                        </div>

                        <div className="expand-collapse-button" onClick={ () => this.expandClick() }>
                            <div id="vertical-div" className={displayPlus}></div>
                            <div id="horizontal-div"></div>
                        </div>
                    </div>
                    
                    <button className="settings-button" onClick = {() => {}}>
                        settings
                    </button>
                </nav>
            )
        }
    }
}