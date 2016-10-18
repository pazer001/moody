import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import {Slider, StyleSheet} from 'react-native'
import {Container, Content, Text} from 'native-base'

@inject('appState') @observer
export default class Settings extends Component {
    render() {
        return (
            <Container>
                <Content>
                    <Text style={styles.itemText}>Volume</Text>
                    <Slider minimumValue={0} maximumValue={1} value={this.props.appState.musicPlayer.currentVolume} onValueChange={volume => {this.props.appState.changeVolume(volume)}}></Slider>
                </Content>
            </Container>
        )
    }
}

const styles    =   StyleSheet.create({
    itemText: {
        color: 'lavender'
    }
})