import React, { Component } from 'react';
import * as firebase from 'firebase';
import {detectTime} from '../../../utils/timeDetector'
import {emojify} from 'react-emojione';
import _ from 'lodash';
import Notifications from '../../../utils/notifications'

import '../../../styles/components/Friend.css';
import Placeholder from '../../../static/images/avatar-placeholder.png';

class Friend extends Component {
    constructor(props){
        super(props)
        this.state = {
            isOnline: false,
        }
        this.watchOnlineStatus();
        this.getPicture(this.props.userID);
        this.notifications = new Notifications();                
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.userID, nextProps.userID)) {
            this.setState({
                pictureURL: ''
            })
            this.getPicture(nextProps.userID);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const lastMessage = this.props.lastMessage;
        if (!_.isEqual(lastMessage, prevProps.lastMessage)) {

            if (!_.isEqual(lastMessage.from,this.props.currentUserEmail) && !document.hasFocus()) {

                this.notifications.spawnNotification(lastMessage.value,this.state.pictureURL, `${this.props.firstName} ${this.props.lastName}`);
            
            }           
        }
    }

    componentWillUnmount() {
        firebase.database().ref(`/users/${this.props.userID}/isOnline`).off('value');
    }

    watchOnlineStatus() {
        const self = this;
        firebase.database().ref(`/users/${this.props.userID}/isOnline`).on('value', function(snapshot) {
             self.setState({
                 isOnline: snapshot.val() || false
             })
        })
    }

    getPicture(id) {
        const self = this;
        
        firebase.database().ref(`/users/${id}/picture/`).once('value', (snapshot) => {
            if (snapshot.val()) {
                const pictureKey = Object.keys(snapshot.val())[0]
                const pictureURL = snapshot.val()[pictureKey].downloadURL;

                self.setState({
                    pictureURL 
                })
            }
           
        })
     
    }

    render() {
        return (
            <div className={`Friend ${this.state.isOnline ? 'is-online' : ''}`} >
                <div className="profile-img">
                    <img style={{
                            maxWidth: '55px',
                            height: 'auto',
                            borderRadius: '50%',
                         }} src={this.state.pictureURL || Placeholder} alt=""/>                
                </div>
                <div className="content" style={{
                                            overflow: 'hidden', 
                                            whiteSpace:'nowrap', 
                                            textOverflow:'ellipsis'
                                         }}>
                    <div className="username">
                        {this.props.firstName + ' ' + this.props.lastName}
                    </div>
                    <span className="last-message">
                        {this.props.lastMessage && emojify(this.props.lastMessage.value, {style: {
                            width: '20px',
                            height: '20px'
                        }})}
                    </span>
                </div>
                <div className="additional" style={{position: 'relative'}}>
                    <div className="actions" style={{left: '50%', transform: 'translateX(-50%)'}}/>
                    <span className="message-date" >
                        {detectTime(this.props.lastMessage.timestamp)}
                    </span>
                </div>
            </div>
        )
    }
}

export default Friend;