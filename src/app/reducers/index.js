import { combineReducers } from 'redux';
import { firebaseStateReducer } from 'react-redux-firebase';
import { routerReducer } from 'react-router-redux';
import { getFilteredMessages, countFilteredMessages } from './messagesReducer';
import { ui } from './ui';

export default combineReducers({
    firebase: firebaseStateReducer,
    routing: routerReducer,
    filteredMessages: getFilteredMessages,
    filteredMessagesAmount: countFilteredMessages,
    ui 
})