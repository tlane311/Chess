import React from 'react';
import ReactDOM from 'react-dom';
import './post-game.css';

const postGameElement = document.getElementById('post-game');

export default class PostGame extends React.Component {
    constructor(props){
        super(props);
        this.element = document.createElement('div')
    }

    componentDidMount() {
        postGameElement.appendChild(this.element);
    }

    componentWillUnmount(){
        postGameElement.removeChild(this.element);
    }

    render() {
        return ReactDOM.createPortal(
            this.props.children,
            this.element
        )
    }
}