import React, { Component } from 'react';
import {AppRegistry} from 'react-native';
import App from './Components/App';
import AppState from './State/AppState';
import {observer, Provider} from 'mobx-react/native';

@observer
class Mobile extends Component {
    render() {
        return (
            <Provider appState={AppState} >
                <App />
            </Provider>
        );
    }
}



AppRegistry.registerComponent('Mobile', () => Mobile);
