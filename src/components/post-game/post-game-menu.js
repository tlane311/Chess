import React from 'react'


export default class PostGameMenu extends React.Component{
    constructor(props){
        super(props);
        //PostGameIsListening()
    }

    handleRematch(){
       //socket stuff
    }
    handleGG(){
        //socket stuff
    }
    handleAnalyze(){
        //socket stuff
    }

    render(){
        return(
            <div className = "post-game-container">
                <h1 className = "result">
                    {this.props.result}
                </h1>

                <nav className = "post-game-options">
                    <button className="background-button" onClick = {this.handleRematch}> Rematch? </button>
                    <button className="bright-accent-button" onClick = {this.handleGG}> "Good Game" </button>
                    <button className="dark-button" onClick = {this.handleAnalyze}> Analyze </button>
                    <button className="escape-button" onClick ={this.handleEscape}> 
                        <div id="negative-slope"></div>
                        <div id="positive-slope"></div>
                    </button>
                </nav>
                
            </div>
        )
    }

}