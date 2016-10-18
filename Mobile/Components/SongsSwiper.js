import React, {Component} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {observer, inject} from 'mobx-react/native';
import Swiper from 'react-native-swiper';

@inject('appState') @observer
export default class SongsSwiper extends Component {

    componentDidMount() {
        this.props.appState._swipedCard();
    }

    renderCards() {
        const songs     =   this.props.appState.currentPlayList;
        return songs.map(song =>
            <View ref="swiperview" key={song.id} style={styles.slide} onLayout={() => this.refs.swiperview.measure(this.props.appState.setDimensions.bind(this.props.appState))}>
                {song.backgroundImage
                    ? <Image  source={{uri: song.backgroundImage}} style={{width: this.props.appState.componentsState.SongsSwiper.coverWidth, height: this.props.appState.componentsState.SongsSwiper.coverHeight}} ><Text style={styles.text}>{song.artist} - {song.title}</Text></Image>
                    : <Text style={styles.text}>{song.artist} - {song.title}</Text>
                }
            </View>)
    }

    render() {
        return (
            <Swiper style={styles.wrapper} ref={(swiper) => {this.props.appState.swiper.swiperRef = swiper;}} showsPagination={false} onMomentumScrollEnd={(e, state, context) => {this.props.appState._swipedCard(e, state, context)}} loop={false} >
                {this.renderCards()}
            </Swiper>
        )
    }
}

var styles = StyleSheet.create({
    wrapper: {
    },
    slide: {
        flex: 1,
    },
    textContainer: {
    },
    text: {
        padding: 2,
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        textAlign: 'center'
    },
    coverImage: {
    }
});
