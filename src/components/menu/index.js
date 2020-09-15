import React from 'react';
import { socket, menuIsListening } from '../../socketIsListening'
import './menu.css';





export class Menu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            inQueue: false,
            localGame: false,
            inGame: false,
            inGameShown: false,
            playerIsLight: null
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
        socket.emit('abandon-queue').close();
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

    render(){
        const inGame = this.state.inGame;
        const inGameShown = this.state.inGameShown;
        const showGameButtons = inGameShown ? " " : " hide-display";
        const displayPlus = !inGameShown ? " " : " hide-display";
        
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
        } else {
            return(
                <nav className="in-game-buttons">
                    <div className="game-buttons-container">
                        <h2>Playing With:</h2>
                        <h2> Guest </h2>
                        
                        <div className={"game-buttons" + showGameButtons}>
                            <button className="dark-button" onClick = {() => this.surrenderClick()}>
                                surrender
                            </button>
                            <button className="background-button" onClick = {() => {}}>
                                draw?
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