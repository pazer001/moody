import React, { Component } from 'react';
import { StyleSheet, View, Dimensions} from 'react-native';
import { Container, Content, Icon, Header, Footer, Button, Text } from 'native-base';
import Drawer from 'react-native-drawer'
import { observer, inject } from 'mobx-react/native';
import Menu from './Menu';
import Body from './Body';
import MusicPlayer from './MusicPlayer';
import SongsSwiper from './SongsSwiper';
import MenuBar from './MenuBar'
import Settings from './Settings'

@inject('appState') @observer
class App extends Component {
    _onLayout() {
        var {height, width} = Dimensions.get('window');
        this.props.appState.appDimensions.width     =   width;
        this.props.appState.appDimensions.height     =   height;
    }

    render() {
        return (
            <Drawer ref={(ref) => this.props.appState.drawer = ref} content={<MenuBar />}
                    type="static"
                    openDrawerOffset={150}
                    tweenHandler={Drawer.tweenPresets.parallax}
                    open={this.props.appState.isSettingsBarOpen}
                    onClose={() => this.props.appState.isSettingsBarOpen = false}
            >
            <Container style={styles.container} onLayout={this._onLayout.bind(this)}>
                <Header style={styles.menuContainer}><Menu /></Header>
                <View style={styles.body}>
                {this.props.appState.currentScreen === 'home'                                                                     ? <Body />          : null}
                {this.props.appState.currentScreen === 'random-playlist' || this.props.appState.currentScreen === 'mood-playlist' ? <SongsSwiper />   : null}
                {this.props.appState.currentScreen === 'settings' ? <Settings />   : null}
                </View>
                <View style={styles.musicPlayer}><MusicPlayer /></View>
            </Container>
            </Drawer>
        );
    }
}

export default App

const styles    =   StyleSheet.create({
    container: {
        backgroundColor:'black',
        flex: 1
    },
    menuContainer: {
        backgroundColor: 'midnightblue'
    },
    body: {
        flex: 4,
    },
    musicPlayer: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        flex: 1
    },
})