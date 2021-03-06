import React, { Component } from 'react';
import { firebaseConnect, pathToJS } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import {initDB} from '../../../db/index';

const componentStyles = {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)'
};

const modalStyles = {
    position: 'absolute',
    zIndex: '99',
    top: '50%',
    left: '50%',
    transform: 'translateY(-50%) translateX(-50%)',
    backgroundColor: 'rgba(35,42,50,0)',
    borderRadius: '5px',
    padding: '50px 80px',
    textAlign: 'center',
    minWidth: '500px',
};

const inputStyles = {
    display: 'block',
    margin: '15px 0',
    fontSize: '16px',
    width: '100%'
};

const buttonStyles = {
    backgroundColor: 'rgba(55,52,71,0.3)',
    textTransform: 'uppercase',
    outline: 'none',
    border: 'none',
    marginBottom: '15px',
    fontSize: '16px',    
}

class AuthModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signIn: true,            
            email: '',
            password: '',
            passwordConfirm: '',
            firstName: '',
            lastName: '',
        };
        try{
            initDB();
        } catch(e) {
        }
    }

    componentWillReceiveProps(props) {
        props.profile ? browserHistory.push('/') : '';
    }

    handleChange(type,e) {
        this.setState({
            ...this.state,
            [type]: e.target.value
        })
    }

    changeType() {
        this.setState({
            signIn: !this.state.signIn,
            error: '',
        })
    }

    checkCredentials(email,password,passwordConfirm,firstName,lastName,signIn,e) {
        e.preventDefault();
        const emailRe = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        if (signIn) {
            this.props.firebase.login({
                email: email,
                password: password,
                type: 'redirect',
            }).then(() => {
                browserHistory.push('/')
            }).catch((err) =>{
                this.setState({
                    ...this.state,
                    error: err
                })
            })
        } else {
            if (!emailRe.test(email)) {
                this.setState({
                    ...this.state,
                    error: {
                        type: 'email',
                        message: 'Wrong email format'
                    }
                })
            } else if (password !== passwordConfirm) {
                this.setState({
                    ...this.state,
                    error: {
                        type: 'passwordConfirm',
                        message: 'Password confirmation fail'
                    }
                })
            } else {
                this.props.firebase.createUser(
                {email, password},
                {
                    email,
                    firstName,
                    lastName,
                    picture: {
                        '-ac': {
                            downloadURL: 'https://firebasestorage.googleapis.com/v0/b/messanger-74db7.appspot.com/o/users%2Favatar-placeholder.png?alt=media&token=82e3afd0-c7e0-4567-8989-bde61ddf72db'
                        }
                    }
                }
                ).then(() => {
                    browserHistory.push('/')
                }).catch(err => {
                    this.setState({
                        ...this.state,
                        error: err
                    })
                })
            }
        }
    }

    render() {
        const errorMessage = (message) => {
            return (
                <div className="error-message">
                    <p>
                        {message}
                    </p>
                </div>
            )
        }

        const login = () => {
            return (
                <div className="modal login" >
                    <h3 style={{color: '#fff', padding: '20px 0', textTransform: 'uppercase', fontSize: '22px'}}>Login</h3>
                    <p style={{fontFamily: '"Roboto", sans-serif', color: '#fff', maxWidth: '250px', textDecoration: 'underline'}}>{this.state.error ? this.state.error.message : ''}</p> 

                    <form action="#" method="POST" onSubmit={this.checkCredentials.bind(this, this.state.email, this.state.password,'','','',this.state.signIn)}>

                        <fieldset >
                            <i className="icon icon-input-user"/>
                            <input type="text" 
                                placeholder="Email" 
                                className="input-default" 
                                style={inputStyles} 
                                onChange={this.handleChange.bind(this,'email')}/>
                        </fieldset>        

                        <fieldset>        
                            <i className="icon icon-lock"/>
                            <input type="password" 
                                placeholder="Password" 
                                name="password" 
                                className="input-default" 
                                style={inputStyles} 
                                onChange={this.handleChange.bind(this,'password')}/>
                        </fieldset>        

                        <div>
                            <span>Don't have an account?</span><span className='register-link' onClick={this.changeType.bind(this)}> Sign up</span>
                        </div>

                        <button className="btn-default pulse" type="submit" style={buttonStyles}>Sign in</button>
                    </form>
                    
                </div>
            )
        };

        const register = () => {
            return (
                <div className="modal register">
                    <form action="#" method="POST" onSubmit={this.checkCredentials.bind(this, this.state.email, this.state.password,this.state.passwordConfirm, this.state.firstName, this.state.lastName,this.state.signIn)}>
                        <p style={{fontFamily: '"Roboto", sans-serif', color: '#fff', maxWidth: '250px', textDecoration: 'underline'}}>{this.state.error ? this.state.error.message : ''}</p> 
                        <h3 style={{color: '#fff', padding: '20px 0', textTransform: 'uppercase', fontSize: '22px'}}>
                        <i className="icon icon-back-arrow" onClick={this.changeType.bind(this)}></i>
                            Sign up
                        </h3>
                        
                        <input type="email" 
                               title="Email" 
                               placeholder="Email" 
                               minLength="5" 
                               maxLength="50" 
                               required 
                               className="input-default" 
                               style={inputStyles} 
                               onChange={this.handleChange.bind(this,'email')}/>  

                        <input type="text" 
                               pattern="([a-zA-Z]{2,30}\s*)+" 
                               title="Max length - 30. Min length - 2 Numbers are not allowed" 
                               placeholder="First Name" 
                               minLength="2" maxLength="30" 
                               required 
                               className="input-default" 
                               style={inputStyles} 
                               onChange={this.handleChange.bind(this,'firstName')}/>

                        <input type="text" 
                               pattern="[a-zA-Z]{2,45}" 
                               title="Max length - 45. Min length - 2. Numbers are not allowed" 
                               placeholder="Last Name" 
                               minLength="2" maxLength="45" 
                               required 
                               className="input-default" 
                               style={inputStyles} 
                               onChange={this.handleChange.bind(this,'lastName')}/>

                        <input type="password" 
                               title="Min length - 6" 
                               placeholder="Password" 
                               minLength="6" 
                               maxLength="30" 
                               required 
                               name="password" 
                               className="input-default" 
                               style={inputStyles} 
                               onChange={this.handleChange.bind(this,'password')}/>

                        <input type="password" 
                               title="Confirm your password" 
                               placeholder="Confirm password" 
                               minLength="6" 
                               maxLength="30" 
                               required 
                               name="password_confirm" 
                               className="input-default" 
                               style={inputStyles} 
                               onChange={this.handleChange.bind(this,'passwordConfirm')}/>

                        <button className="btn-default pulse" type="submit" style={buttonStyles}>Register</button>
                    </form>
                </div>
            )
        };
        return (
            <div className="Auth-Modal" style={componentStyles}>
                <div className="modal-group" style={modalStyles}>
                    { this.state.signIn ? login() : register() }
                </div>
            </div>
        )
    }
};

const wrappedAuth = firebaseConnect()(AuthModal);

export default connect(
    ({ firebase }) => ({
        profile: pathToJS(firebase, 'profile')
    })
)(wrappedAuth)