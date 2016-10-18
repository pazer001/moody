import React, { Component } from 'react';
import {StyleSheet, View, Modal, Slider} from 'react-native';
import {observer, inject} from 'mobx-react/native';
import { Container, Content, Button } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Progress from 'react-native-progress';

@inject('appState') @observer
export default class MusicPlayer extends Component {
    render() {
        return(
                <Grid style={{flex: 1, flexDirection: 'column'}}>
                    <Row style={styles.loader}><Progress.Bar animated indeterminate width={(this.props.appState.musicPlayer.duration <= 0 && this.props.appState.chosenPlaylist) ? 500 : 0} borderWidth={0} color="midnightblue" borderColor="lavender"  /></Row>

                    <Row>
                        <View style={styles.progressBar}>
                            <Slider style={styles.slider} disabled={this.props.appState.musicPlayer.duration <= 0}  minimumValue={0} maximumValue={this.props.appState.musicPlayer.duration} value={this.props.appState.musicPlayer.currentTime} onValueChange={time => {this.props.appState.seek(time)}} />
                        </View>
                    </Row>
                    <Row>
                        <Button info iconLeft small style={styles.button} onPress={() => {this.props.appState.pause()}}>
                            <Icon name='pause-circle' style={styles.icon} />
                        </Button>
                        <Button info iconLeft small style={styles.button} onPress={() => {this.props.appState.play()}}>
                            <Icon name='play-circle' style={styles.icon} />
                        </Button>
                        <Button info iconLeft small style={styles.button} onPress={() => {this.props.appState.stop()}}>
                            <Icon name='stop-circle' style={styles.icon} />
                        </Button>
                    </Row>
                </Grid>
        )
    }
}

const styles    =   StyleSheet.create({
    button: {
        borderRadius: 0,
        flex: 1,
        backgroundColor: 'midnightblue',
    },
    progressBar: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',

    },
    slider: {
        borderColor : 'midnightblue'
    },
    icon: {
        fontSize: 25,
        color: 'lavender'
    },
    loader: {
        position: 'absolute',
        zIndex: 1,
    }

})

