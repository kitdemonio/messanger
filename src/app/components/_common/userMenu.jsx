import React, { Component } from 'react';
import { firebaseConnect } from 'react-redux-firebase';

const menuStyles = {
    border: '1px solid #eee',
    position: 'absolute',
    zIndex: '10',
    width: '100%',
    background: '#fff',
    bottom: '-90px'
};

class UserMenu extends Component {

    render() {
        return (
            <div className="user-menu" style={menuStyles}>
                <ul>
                    <li style={{ borderBottom: '1px solid #eee', padding: '10px 0', textAlign: 'center' }}><a href="#" 
                    onClick={() => {this.props.firebase.logout()}}>Log out</a></li>
                    <li style={{ padding: '10px 0', textAlign: 'center' }}><a href="#">Help</a></li>
                </ul>
            </div>
        )
    }
}

export default firebaseConnect()(UserMenu);