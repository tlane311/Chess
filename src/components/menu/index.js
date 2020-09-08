import React from 'react';
import { socket } from '../../socketIsListening'





export class Menu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            inQueue: false,
            localGame: false,
        }
    }

    async queueClick() { 
        if (this.state.inQueue) {
            //warn user they are in queue
            console.log('you are already in queue')
        } else {
            await this.setState({
                inQueue: true
            });
            await socket.emit('queue');
        }
    }

    async localClick(){
        await socket.emit('abandon-queue');
        await this.setState({
            localGame: true,
            inQueue: false
        });
    }

    render(){
        return(
            <nav>
                <button className="local-button" onClick = { () => this.localClick() }>
                    Play With Yourself
                </button>
                <button className="online-button" onClick = { () => this.queueClick() }>
                    Connect with Opponent
                </button>
            </nav>
        )
    }
}