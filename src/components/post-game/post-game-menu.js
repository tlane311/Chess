import React from 'react'
import { socket, postGameIsListening } from '../../socketIsListening'

export default class PostGameMenu extends React.Component{
    constructor(props){
        super(props);
        this.state={
            rematchRequested: false,
            rematchRequestSent: false,
            rematchDeclined: false,
            otherPlayerHasLeft: false,
        };
        postGameIsListening.bind(this)();
    }

    handleRematch(){
        if (this.state.rematchDeclined) return null;
        if (this.state.otherPlayerHasLeft) {
            this.setState({
                rematchDeclined: true,
            });
            return null;
        }
        this.setState({
            rematchRequestSent: true,
        });
       socket.emit('rematch-request');

       console.log('post-game-menu is trying to request match');
    }

    handleRematchReply(bool){
        //socket.emit('rematch-accepted')
        return (() => bool ? (
                socket.emit('rematch-accepted')) 
            : (
                socket.emit('rematch-declined'),
                this.setState({
                    rematchDeclined: true
                })
            ));

    }

    handleNewGame = () => {
        this.props.newGame(true);
    }

    render(){
        //local game post-game-menu
        const localGame = this.props.localGame;
        
        if (localGame) {
            return(
                <div className = "post-game-container">
                    <h1 className = "result">
                        {this.props.result}
                    </h1>

                    <nav className = "post-game-options">
                        <button className="background-button" onClick = {this.handleNewGame}> New Game </button>
                        
                        <button className="dark-button" onClick = {this.props.escape}> Analyze </button>
                        <button className="escape-button" onClick ={this.props.escape}> 
                            <div id="negative-slope"></div>
                            <div id="positive-slope"></div>
                        </button>
                    </nav>
            
                </div>
            )

        }
        
        
        
        
        
        
        
        //online game post-game-menu
        const sentRequest = this.state.rematchRequestSent ? "Request Sent" : "Rematch?"
        const rematchDeclined = this.state.rematchDeclined || this.state.otherPlayerHasLeft ? "Request Declined" : sentRequest;
        const rematchButton = this.state.rematchRequested
        ? (
            <div className="rematch-response">
                <button className="background-button" id="accept-rematch" 
                onClick = {this.handleRematchReply(true)}> 
                Accept Rematch </button>
                <button className="inverted-background-button" id="decline-rematch" 
                onClick = {this.handleRematchReply(false)}> 
                Decline Rematch </button>
            </div>
        )
        : <><button className="background-button" onClick = {() => this.handleRematch()}> {rematchDeclined} </button></>
        






        return(
            <div className = "post-game-container">
                <h1 className = "result">
                    {this.props.result}
                </h1>

                <nav className = "post-game-options">
                    {rematchButton}
                    
                    <button className="dark-button" onClick = {this.props.escape}> Analyze </button>
                    <button className="escape-button" onClick ={this.props.escape}> 
                        <div id="negative-slope"></div>
                        <div id="positive-slope"></div>
                    </button>
                </nav>
                
            </div>
        )
    }

}

//<button className="bright-accent-button" onClick = {this.handleGG}> "Good Game" </button>