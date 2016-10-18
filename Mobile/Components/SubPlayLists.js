import React, { Component } from 'react';
import {StyleSheet, Modal} from 'react-native';
import { Icon, Card, CardItem, Text } from 'native-base';
import ModalPicker from 'react-native-modal-picker'
import {observer, inject} from 'mobx-react/native';

@inject('appState') @observer
export default class SubPlayLists extends Component {


    render() {
        if(!this.props.appState.subPlaylists[this.props.appState.currentChosedMainPlaylist]) return null;
        return(
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.appState.subPlaylistsModalVisible}
                onRequestClose={() => {alert("Modal has been closed.")}}
            >
                <Card>
                    <CardItem style={styles.closeSubPlaylistsModal}  onPress={this.props.appState._closeSubPlaylistsModal.bind(this.props.appState, 'close')}>
                        <Icon style={styles.closeSubPlaylistsModalText} name='ios-close-circle' onPress={this.props.appState._closeSubPlaylistsModal.bind(this.props.appState, 'close')} />
                        <Text style={styles.closeSubPlaylistsModalText}>Close</Text>
                    </CardItem>
                    {this.props.appState.subPlaylists[this.props.appState.currentChosedMainPlaylist].map(playlist =>
                        <CardItem style={styles.itemSubPlaylistsModal} key={playlist} onPress={this.props.appState._closeSubPlaylistsModal.bind(this.props.appState, playlist)}>
                            <Icon style={styles.itemSubPlaylistsModalText} name='ios-close-circle' onPress={this.props.appState._closeSubPlaylistsModal.bind(this.props.appState, playlist)} />
                            <Text>{playlist}</Text>
                        </CardItem>
                    )}
                </Card>
            </Modal>
            )
    }
}

const styles    =   StyleSheet.create({
    closeSubPlaylistsModal: {
        backgroundColor: 'midnightblue'
    },
    closeSubPlaylistsModalText: {
        color: 'lavender'
    },
    itemSubPlaylistsModal: {
        backgroundColor: 'lavender'
    },
    itemSubPlaylistsModalText: {
        color: 'midnightblue'
    }
});