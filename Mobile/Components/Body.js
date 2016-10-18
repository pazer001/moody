import React, { Component } from 'react';
import {StyleSheet, View, Modal} from 'react-native';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { Content, Button, Card, CardItem, Text, Thumbnail, Icon } from 'native-base';


import SubPlayLists from './SubPlayLists'
import {observer, inject} from 'mobx-react/native';


@inject('appState') @observer
class Body extends Component {
    constructor() {
        super();
        this.state              =   {};
        this.state.playlists    =   [];
    }

    componentDidMount() {
        this.props.appState._connect();
        this.props.appState.getPlaylists();
    }

    renderPlaylists() {
        const mainPlaylistsKeys     =   Object.keys(this.props.appState.mainPlaylists);
        let mainPlaylists   =   [];
        if(!mainPlaylistsKeys.length) return <View />;
        for(var mainPlaylistsKeysIndex in mainPlaylistsKeys) {
            mainPlaylists.push(<Button bordered style={styles.playlistsButtons} textStyle={styles.playlistsText} key={mainPlaylistsKeysIndex} onPress={this.props.appState._showSubPlaylist.bind(this.props.appState, mainPlaylistsKeys[mainPlaylistsKeysIndex])}>
                <Icon name={this.props.appState.mainPlaylistsIcons[mainPlaylistsKeys[mainPlaylistsKeysIndex]]} />
                {mainPlaylistsKeys[mainPlaylistsKeysIndex]}
            </Button>)
        }
        return mainPlaylists

    }

    render() {
        return (
            <Grid>
                {/*Error Modal*/}
                <Modal visible={this.props.appState.componentsState.Body.firstGetTokenTry && (!this.props.appState.getTokenResponse['subsonic-response'] || this.props.appState.getTokenResponse['subsonic-response'].status !== 'ok')} animationType={"fade"} transparent={true} onRequestClose={() => {alert("Modal has been closed.")}} >
                    <View>
                        <Card>
                            <CardItem header>
                                <Text>Error!</Text>
                            </CardItem>
                            <CardItem cardBody>
                                <Text>Error occurred while connecting the server</Text>
                            </CardItem>
                            <CardItem footer>
                                <Button warning block onPress={() => {this.props.appState._connect()}}>Try connect again ...</Button>
                            </CardItem>
                        </Card>
                    </View>
                </Modal>

                {/*Show playlist moods*/}
                <SubPlayLists/>

                <Row style={styles.random}>
                    <Content>
                        <Button block  onPress={() => this.props.appState._getRandomSongs()}><Icon name='ios-star' />Random</Button>
                    </Content>
                </Row>
                <Row  style={styles.mainMood}>
                    <Content>
                        <View style={styles.playlists}>
                            {this.renderPlaylists()}
                        {/*<Moods />*/}
                        </View>
                    </Content>
                </Row>
            </Grid>
        )
    }
}

const styles    =   StyleSheet.create({
    random: {
        flex: 1,
        marginTop: 1
    },
    mainMood: {

        flex: 5
    },
    playlists: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    playlistsButtons: {
        flex: 1,
        width: 75,
        alignItems: 'stretch',
        justifyContent: 'center',
        margin: 1,
    },
})

export default Body