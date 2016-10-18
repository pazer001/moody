import React, { Component } from 'react';
import {StyleSheet} from 'react-native'
import { observer, inject } from 'mobx-react/native';
import { Container, Content, List, ListItem, Text, Icon } from 'native-base';



@inject('appState') @observer
export default class MenuBar extends Component {
    render() {
        return (
            <Container style={styles.container}>
                <Content>
                    <Text style={styles.collapse} onPress={this.props.appState.setBarMenu.bind(this.props.appState)}> <Icon style={styles.collapse} name='md-arrow-dropleft-circle' /></Text>
                    <List>
                        <ListItem>
                            <Text style={styles.settingsItemText} onPress={this.props.appState.runMenuItem.bind(this.props.appState, 'home')}><Icon style={styles.settingsItemText} name='md-home' /> Home</Text>
                        </ListItem>
                        <ListItem>
                            <Text style={styles.settingsItemText} onPress={this.props.appState.runMenuItem.bind(this.props.appState, 'settings')}><Icon style={styles.settingsItemText} name='md-settings' /> Settings</Text>
                        </ListItem>
                        <ListItem >
                            <Text onPress={this.props.appState.exitApp.bind(this.props.appState)} style={styles.settingsItemText}><Icon style={styles.settingsItemText} name='md-exit' /> Exit</Text>
                        </ListItem>
                    </List>
                </Content>
            </Container>
        )
    }
}

const styles    =   StyleSheet.create({
    container: {
        backgroundColor: 'lavender',
    },
    collapse: {
        textAlign: 'right',
        margin: 2,
        // fontSize: 20,
        color: 'midnightblue',
    },
    settingsItemText: {
        color: 'midnightblue',
    }
})