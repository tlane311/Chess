import React from 'react';
import { socket } from '../../socketIsListening'
import './menu.css';





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
            <nav className="menu-buttons">
                <button className="local-button" onClick = { () => this.localClick() }>
                    local play
                </button>
                <button className="online-button" onClick = { () => this.queueClick() }>
                    play online
                </button>
                <button className="settings-button" onClick = {() => {}}>
                    settings
                </button>
            </nav>
        )
    }
}