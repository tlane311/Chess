import React from 'react';
import { socket, menuIsListening } from '../../socketIsListening'
import './menu.css';





export class Menu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            inQueue: false,
            localGame: false,
            localMenuShown: false, //decides when menu expands
            onlineGame: false, 
            onlineMenuShown: false, //decides when menu expands
            playerIsLight: null, 
            //player color is stored in state since we might need to pass it to server if the player surrenders or asks for draws
            //note, the menu does not talk directly to game
            drawRequested: false,   // affects onlineGameMenu
            drawRequestSent: false, // affects onlineGameMenu
            drawDeclined: false,    // affects onlineGameMenu
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
                inQueue: true,
                localGame: false
            });
        }
    }

    localClick(){     
        if (this.state.inQueue) {
            socket.emit('abandon-queue').close();
            }
        this.setState({
            localGame: !this.state.localGame,
            localMenuShown: false,
            inQueue: false
        });
    }

    expandClick(){
        if (this.state.localGame) {
            const localMenuShown = this.state.localMenuShown;
            this.setState({
                localMenuShown: !localMenuShown
            })
        }
        if (this.state.onlineGame) {
            const onlineMenuShown = this.state.onlineMenuShown;
            this.setState({
                onlineMenuShown: !onlineMenuShown
            })
        }

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
        const invertedOnlineButton = this.state.inQueue ? " inverted-button" : "";
        const playOnlineText = this.state.inQueue ? "finding game" : "play online";


        const onlineGame = this.state.onlineGame;
        
        
        const onlineMenuShown = this.state.onlineMenuShown;
        const showGameButtons = onlineMenuShown ? " " : " hide-display";    //using css, controls what buttons are displayed 
        const displayPlus = !onlineMenuShown ? " " : " hide-display";       //using css, controls if the + or - is displayed 
        
        const drawRequested = this.state.drawRequested;
        const sentDrawRequest = this.state.drawRequestSent ? "Requested": "draw?"
        const drawDeclined = this.state.drawDeclined ? "Declined" : sentDrawRequest;
        
        
        const localGame = this.state.localGame;
        const invertedLocalButton = localGame ? " inverted-button" : "";

        if (onlineGame) { 
            if (!drawRequested){    
                return(
                    <>
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
                    </nav>

                    <nav>
                        <button className="settings-button" onClick = {() => {}}>
                            settings
                        </button>
                    </nav>
                    </>
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
        
        return( //this is what is returned when not in localGame or onlineGame
            <nav className="menu-buttons">
                <button className={"dark-button"+invertedLocalButton} onClick = { () => this.localClick() }>
                    local play
                </button>
                <button className={"background-button"+invertedOnlineButton} onClick = { () => this.queueClick() }>
                    {playOnlineText}
                </button>
                <button className="settings-button" onClick = {() => {}}>
                    settings
                </button>
            </nav>
        )
    }
}