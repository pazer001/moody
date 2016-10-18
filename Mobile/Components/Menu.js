import React, { Component } from 'react';
import {StyleSheet} from 'react-native'
import { Title, Button   } from 'native-base';
import { observer, inject } from 'mobx-react/native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Icon from 'react-native-vector-icons/FontAwesome';

@inject('appState') @observer
export default class Menu extends Component {
    render() {
        return (

                <Grid >
                    <Col >
                        <Button transparent onPress={this.props.appState.setBarMenu.bind(this.props.appState)}>
                            <Icon color="lavender" name='bars' />
                        </Button>
                    </Col>
                </Grid>
        )
    }
}

const styles    =   StyleSheet.create({
    menuContainer: {
        backgroundColor: 'midnightblue'
    }
})