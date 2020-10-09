//NOTE THIS HAS NOT BEEN IMPLEMENTED

import React from 'react'
import './login.css'

function LoginOptions(props) {
    return (
        <div className="login-options">
            <button onClick={props.login}> login </button>
            <button onClick={props.newAccount}> new account</button>
        </div>
    );
}

function ReturnLogin(props){
    return (
        <div className="return-login">
            <label>Welcome Back</label>
            <input type="text" placeholder="username"/>
            <input type="text" placeholder="password"/>
            <div className="remember-me">
                <input type="checkbox" value ="rememberme" id="rememberme"/>
                <label for="rememberme"> remember me </label>
            </div>
            <button id="continue-button" onClick = {props.continue}> continue </button>
        </div>
    );
}

function NewLogin(props){
    return (
        <div className="new-login">
            <label>Create Account </label>
            <input type="username" placeholder="username"/>
            <input type="password" placeholder="password"/>
            <div className="remember-me">
                <input type="checkbox" value ="rememberme" id="rememberme"/>
                <label for="rememberme"> remember me </label>
            </div>
            <button id="continue-button" onClick = {props.continue}> continue </button>
        </div>
    );
}


export class Login extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            displayOptions: true, 
            returningUser: false,
        };
    }

    returnLoginClick(){
        this.setState({
            displayOptions: false,
            returningUser: true
        })
    }

    newUserClick(){
        this.setState({
            displayOptions: false,
            returningUser: false
        })
    }

    continueClick(){
        return null;
    }

    render(){
        const displayOptions = this.state.displayOptions;
        const returningUser = this.state.returningUser;

       if (displayOptions) {
            return(
                <div className= "login-display">
                    <LoginOptions
                        login = {() => this.returnLoginClick()}
                        newAccount = { () => this.newUserClick()}
                    />
                </div>
            )
        } else if (returningUser) {
            return (
                <div className= "login-display">
                    <ReturnLogin
                        continue = {() => this.continueClick()}
                    />
                </div>
            )
        } else {
            return(
                <div className= "login-display">
                    <NewLogin
                    continue = {() => this.continueClick()}
                    />
                </div>
            )
        }
    }
}