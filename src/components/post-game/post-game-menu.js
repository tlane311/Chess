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
            <>
            <div className = "result">
                {this.props.result}
            </div>

            <nav className = "post-game-options">
                <button onClick = {this.handleRematch}> Rematch? </button>
                <button onClick = {this.handleGG}> "Good Game" </button>
                <button onClick = {this.handleAnalyze}> Analyze </button>
            </nav>
            </>
        )
    }

}