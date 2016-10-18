import React, { Component } from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Grid} from 'native-base'

export default class CurrentPlaying extends Component {
    render() {
        return (
            <Grid style={styles.container}>
                <Text style={styles.songName}>Test</Text>
            </Grid>
        )
    }
}

const styles    =   StyleSheet.create({
    container: {
        height: 500
    },
    songName: {
        color: 'white'
    }
})