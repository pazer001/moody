import {observable, action} from "mobx";
import md5 from 'js-md5';
import Dimensions from 'Dimensions';
import {Player} from 'react-native-audio-toolkit';
import cheerio from 'cheerio-without-node-native';
import _ from 'lodash';
import PushNotification from 'react-native-push-notification';
import {BackAndroid, AppState as ReactAppState } from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import BackgroundTimer from 'react-native-background-timer';



class AppState {
    @observable appDimensions           =   {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    };


    @observable serverData              =   {
        url: 'http://84.111.189.160',
        port: 4040,
        salt: 'c9j98y5t',
        userName: 'admin',
        token: md5('admin' + 'c9j98y5t'),
        apiVersion: `1.14.0`,
        uniqueStringIdentifying: `moody`,
        dataType: `json`
    }

    @observable audioscrobbler          =   {
        key: '139a96cb14ed17c934908c948e5e1b67'
    }

    @observable allMethodsParams        =   `u=${this.serverData.userName}&t=${this.serverData.token}&s=${this.serverData.salt}&v=${this.serverData.apiVersion}&c=${this.serverData.uniqueStringIdentifying}&f=${this.serverData.dataType}`;
    @observable allMethodsParamsOut     =   `u=${this.serverData.userName}&t=${this.serverData.token}&s=${this.serverData.salt}&v=${this.serverData.apiVersion}&c=${this.serverData.uniqueStringIdentifying}`;

    @observable urls                    =   {
        tokenUrl: `${this.serverData.url}:${this.serverData.port}/rest/ping.view?u=admin&t=${this.serverData.token}&s=${this.serverData.salt}&v=1.14.0&c=moody&f=${this.serverData.dataType}&`,
        getRandomSongs: `${this.serverData.url}:${this.serverData.port}/rest/getRandomSongs.view?size=7&${this.allMethodsParams}&f=${this.serverData.dataType}&`,
        searchCover: `https://api.discogs.com/database/search`,
        stream: `${this.serverData.url}:${this.serverData.port}/rest/download.view?`,
        getPlaylists: `${this.serverData.url}:${this.serverData.port}/rest/getPlaylists.view?${this.allMethodsParams}`,
        getPlaylist: `${this.serverData.url}:${this.serverData.port}/rest/getPlaylist.view?${this.allMethodsParams}`,
    };

    @observable currentServerData       =   {
        getRandomSongs: {},
        discogsRequestToken: {},
        discogsAccessToken: {},
        currentSongCover: {},
        playlists: {}
    };

    @observable currentPlayList         =   [];
    @observable currentPlayingSongId    =   {};
    @observable isPlaying               =   false;
    @observable currentScreen           =   'home';

    @observable mainPlaylistsIcons            =   {
        Any: `ios-microphone`,
        Car: `ios-car`,
        Home: `ios-home`,
        Party: `md-musical-notes`,
        Work: `ios-clipboard`,
        Friends: `ios-people`,
        Love: `ios-heart`,
        Outside: `ios-walk`,
        Sport: `ios-football`,
    };

    @observable componentsState         =   {
        Body: {
            firstGetTokenTry: false
        },
        SongsSwiper: {
            coverWidth: 250,
            coverHeight: 250,
        }
    }

    @observable chosenPlaylist          =   null;

    @observable swiper                  =   {
        currentCardId: 0,
        swiperRef: null,
        width: 250,
        height: 250
    };

    @observable musicPlayer             =   {
        currentSelectedSong: {},
        duration: null,
        currentTime: null,
        currentAudioSeekTime: null,
        currentAudio: null,
        currenSongId: null,
        currentVolume: 1
    };

    @observable mainPlaylists               =   {};
    @observable subPlaylists                =   {};
    @observable currentChosedMainPlaylist   =   null;
    @observable currentChosedSubPlaylist    =   null;
    @observable selectedSubPlaylistId       =   null;

    @observable subPlaylistsModalVisible    =   false;
    @observable getTokenResponse            =   {};
    @observable drawer                      =   null;
    @observable isSettingsBarOpen           =   false;

    @action _connect() {
        this.getSubsonicToken();
    }

    @action getSubsonicToken() {
        fetch(this.urls.tokenUrl)
            .then(response => response.json())
            .then(data => {
                this.componentsState.Body.firstGetTokenTry    =   true;
                this.getTokenResponse = data
            })
    }

    @action checkForNewPlaylistItems() {
        if(this.currentPlayList.length - this.swiper.currentCardId <= 5) {
            if(this.chosenPlaylist === 'random') {
                this._getRandomSongs();
            } else if(this.chosenPlaylist) {
                this._getSubPlaylist(this.currentChosedSubPlaylist)
            }
        }
    }

    @action play() {

        this.stop();
        var playbackOptions = {
            autoDestroy: true,
            continuesToPlayInBackground: true
        };

        var url   =   `${this.urls.stream}id=${this.musicPlayer.currentSelectedSong.id}&maxBitRate=320&format=mp3&${this.allMethodsParamsOut}`;
        this.player = new Player(url, playbackOptions);

        this.player.play();
        this.isPlaying   =   true;

        this.createNotification('play')
        this.player.wakeLock    =   true;
    }

    @action createNotification(type) {
        var self    =   this;
        this.PushNotification.localNotification({
            /* Android Only Properties */
            id: '0', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            autoCancel: false, // (optional) default: true
            largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
            smallIcon: `ic_${type}`,
            color: '#191970',
            vibrate: false, // (optional) default: true
            ongoing: true, // (optional) set whether this is an "ongoing" notification

            /* iOS and Android properties */
            title: `${self.musicPlayer.currentSelectedSong.title || ''}`, // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
            message: `${self.musicPlayer.currentSelectedSong.artist || ''}`, // (required)
            playSound: false, // (optional) default: true
        });
    }


    @action setProgressBar() {
        BackgroundTimer.clearInterval(this.progressBarInterval);
        this.progressBarInterval      =   BackgroundTimer.setInterval(() => {
            if(this.player && this.player.duration) {
                // console.log(this.player.currentTime)
                this.musicPlayer.duration = this.player.duration;
                this.musicPlayer.currentTime = this.player.currentTime;
                if (this.musicPlayer.duration === this.musicPlayer.currentTime && this.musicPlayer.currentTime > 0) {
                    clearInterval(this.progressBarInterval);
                    if (this.swiper.swiperRef) this.swiper.swiperRef.scrollBy(1);

                }
            }
        }, 1000)
    }

    @action stop() {
        if(this.player && this.player.stop) {
            this.player.stop()
            this.createNotification('stop')
        }
    }

    @action seek(time) {
        if(this.player && this.player.seek) this.player.seek(time);
    }

    @action pause() {
        this.player.playPause((error, isPaused) => {this.createNotification(isPaused ? 'pause' : 'play')})
    }

    @action changeVolume(volume) {
        if(this.player && this.player.volume) this.player.volume  =   volume

    }

    @action _getRandomSongs() {
        if(this.chosenPlaylist !== 'random') this.currentPlayList = [];
        fetch(this.urls.getRandomSongs)
            .then(response => response.json())
            .then(data => {
                var songIndex   =   0;
                for(songIndex; songIndex < data['subsonic-response'].randomSongs.song.length; songIndex++ ){
                    data['subsonic-response'].randomSongs.song[songIndex].backgroundImage  =    null;
                    this.currentPlayList.push(data['subsonic-response'].randomSongs.song[songIndex])
                }
                this.chosenPlaylist = 'random';
                this.currentScreen  =   'random-playlist'
            })
    }

    @action _swipedCard(e, state, context) {
        this.swiper.currentCardId               =   context ? context.state.index : 0;
        this.musicPlayer.currentSelectedSong    =   this.currentPlayList[this.swiper.currentCardId];

        this.fetchCoverFromAudioScrobblerByTitle()
            .catch(this.fetchCoverFromAudioScrobblerByAlbum.bind(this))
            .catch(this.fetchCoverFromAudioScrobblerByArtist.bind(this))
            .catch(this.fetchCoverFromYahoo.bind(this))
            .catch(this.fetchCoverFromBing.bind(this))
            .catch(() => {});

        this.isPlaying   =   false;
        this.play();
        this.checkForNewPlaylistItems();
    }


    //Fetch Background Cover
    @action fetchCoverFromAudioScrobblerByTitle() {
        var self    =   this;
        return new Promise((resolve, reject) => {
            const searchCoverUrl       =   `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${self.audioscrobbler.key}&artist=${self.musicPlayer.currentSelectedSong.artist.replace('&', 'and')}&track=${self.musicPlayer.currentSelectedSong.title.replace(/ *\([^)]*\) */g, "")}&format=json`

            fetch(searchCoverUrl)
                .then(response => response.json())
                .then(data => {
                    if(data && data.error === 6) reject('test');
                    if(data && data.track && data.track.album && data.track.album.image) {
                        self.currentPlayList[self.swiper.currentCardId].backgroundImage     =   data.track.album.image.pop()['#text'] || null;
                    } else {
                        self.currentPlayList[self.swiper.currentCardId].backgroundImage     =   null;
                    }

                    if(!self.currentPlayList[self.swiper.currentCardId].backgroundImage) reject('test')
                    console.log('fetchCoverFromAudioScrobblerByTitle', self.currentPlayList[self.swiper.currentCardId].backgroundImage)
                })
        })
    }

    @action fetchCoverFromAudioScrobblerByAlbum() {
        var self    =   this;
        return new Promise((resolve, reject) => {
            // if(this.currentPlayList[self.swiper.currentCardId].backgroundImage) {resolve(0); return;}
            const searchCoverUrl       =   `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${self.audioscrobbler.key}&artist=${self.musicPlayer.currentSelectedSong.artist}&format=json`

            fetch(searchCoverUrl)
                .then(response => response.json())
                .then(data => {
                    if(data && data.error === 6) reject('test');
                    if(data && data.album && data.album.image) {
                        self.currentPlayList[self.swiper.currentCardId].backgroundImage     =   data.album.image.pop()['#text'] || null;
                    } else {
                        self.currentPlayList[self.swiper.currentCardId].backgroundImage     =   null;
                    }

                    if(!self.currentPlayList[self.swiper.currentCardId].backgroundImage) reject('test')
                    console.log('fetchCoverFromAudioScrobblerByAlbum', self.currentPlayList[self.swiper.currentCardId].backgroundImage)
                })
        })
    }

    @action fetchCoverFromAudioScrobblerByArtist() {
        var self    =   this;
        return new Promise((resolve, reject) => {
            // if(this.currentPlayList[self.swiper.currentCardId].backgroundImage) {resolve(0); return;}
            const searchCoverUrl       =   `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=${self.audioscrobbler.key}&artist=${self.musicPlayer.currentSelectedSong.artist}&format=json`

            fetch(searchCoverUrl)
                .then(response => response.json())
                .then(data => {
                    if(data && data.error === 6) reject('test');
                    if(data && data.artist && data.artist.image) {
                        self.currentPlayList[self.swiper.currentCardId].backgroundImage     =   data.artist.image.pop()['#text'] || null;
                    } else {
                        self.currentPlayList[self.swiper.currentCardId].backgroundImage     =   null;
                    }

                    if(!self.currentPlayList[self.swiper.currentCardId].backgroundImage) reject('test')
                    console.log('fetchCoverFromAudioScrobblerByArtist', self.currentPlayList[self.swiper.currentCardId].backgroundImage)
                })
        })
    }

    @action fetchCoverFromBing() {
        var self    =   this;
        return new Promise((resolve, reject) => {
            // if(this.currentPlayList[self.swiper.currentCardId].backgroundImage) {resolve(0); return;}
            const searchCoverUrl    =   `https://www.bing.com/images/async?q=${self.musicPlayer.currentSelectedSong.artist} ${self.musicPlayer.currentSelectedSong.title}&async=content&first=71&count=1&dgst=ro_u438*&IID=images.1&SFX=2&IG=BEA30E293B3B44F5B087D24DF91FB33B&CW=1903&CH=356&CT=1476434590614&form=QBIR`;

            fetch(searchCoverUrl)
                .then(res => {
                    return res.text();
                }).then(body => {
                let $ = cheerio.load(body),
                    backgroundImage     =   null;
                var dataToParse     =   $('.imgres a').first().attr('m');
                if(dataToParse) {
                    var startSlice = $('.imgres a').first().attr('m').indexOf('imgurl:"'),
                        endSlice = $('.imgres a').first().attr('m').indexOf('",tid:');
                    backgroundImage = $('.imgres a').first().attr('m').substring(startSlice, endSlice).replace('imgurl:"', '');
                    self.currentPlayList[self.swiper.currentCardId].backgroundImage = backgroundImage;
                    console.log('fetchCoverFromBing', backgroundImage)
                }
                if(!self.currentPlayList[self.swiper.currentCardId].backgroundImage) reject('test')
            });
        });
    }

    @action fetchCoverFromYahoo() {
        var self    =   this;
        return new Promise((resolve, reject) => {
            // if(this.currentPlayList[self.swiper.currentCardId].backgroundImage) {resolve(0); return;}

            const searchCoverUrl    =   `http://images.search.yahoo.com/search/images;_ylt=AwrB8pRaQQFY400AU2mJzbkF?p=${self.musicPlayer.currentSelectedSong.artist} ${self.musicPlayer.currentSelectedSong.title}&ei=UTF-8&y=Search&fr=sfp&imgsz=large&fr2=p%3As%2Cv%3Ai`;
            fetch(searchCoverUrl)
                .then(res => res.text())
                .then(body => {
                    let $ = cheerio.load(body);
                    let queryUrl    =   `http://images.search.yahoo.com/${$('#res-cont').find('a').first().prop('href')}`;
                    fetch(queryUrl)
                        .then(res => res.text())
                        .then(body => {
                            let $ = cheerio.load(body);
                            let pageScript  =      $('#data-cntr script').first().html();
                            if(pageScript) {
                                var backgroundImage     =   JSON.parse(pageScript.replace('jsData =', '')).results[0].oi;
                                self.currentPlayList[self.swiper.currentCardId].backgroundImage = backgroundImage;
                            }

                            if(!self.currentPlayList[self.swiper.currentCardId].backgroundImage) reject('test')
                            console.log('fetchCoverFromYahoo', backgroundImage);

                    });
                });
        })
    }

    @action getPlaylists() {
        fetch(this.urls.getPlaylists)
            .then(response => response.json())
            .then(data => {
                if(data && data.error === 6) return;
                const playlists   =   data['subsonic-response'].playlists.playlist;
                let mainPlaylists   =   {},
                    subPlaylists    =   {}
                for(var playlistIndex in playlists) {
                    // Set Main Playlists
                    mainPlaylists[playlists[playlistIndex].name.split('-')[0].trim()]  =   playlists[playlistIndex].name.split('-')[0].trim();

                    // Set Sub Playlists
                    if(!this.subPlaylists[playlists[playlistIndex].name.split('-')[0].trim()]) this.subPlaylists[playlists[playlistIndex].name.split('-')[0].trim()] = []
                    this.subPlaylists[playlists[playlistIndex].name.split('-')[0].trim()].push(playlists[playlistIndex].name.split('-')[1].trim());

                    this.currentServerData.playlists[playlists[playlistIndex].name.split('-')[1].trim()]   =   playlists[playlistIndex]
                }

                this.mainPlaylists  =   Object.assign({}, mainPlaylists);
            })
    }

    @action _showSubPlaylist(mainPlaylist) {
        this.subPlaylistsModalVisible       =   true;
        this.currentChosedMainPlaylist      =   mainPlaylist;
    }

    @action _closeSubPlaylistsModal(subPlaylist) {
        this.subPlaylistsModalVisible     =   false;
        if(subPlaylist !== 'close') {
            this._getSubPlaylist(subPlaylist)
        }
    }

    @action _getSubPlaylist(subPlaylist) {
        if(subPlaylist !== this.chosenPlaylist) this.currentPlayList = []
        this.currentChosedSubPlaylist   =   subPlaylist;
        this.selectedSubPlaylistId     =   this.currentServerData.playlists[this.currentChosedSubPlaylist].id;
        fetch(`${this.urls.getPlaylist}&id=${this.selectedSubPlaylistId}`)
            .then(response => response.json())
            .then(data => {
                let songIndex   =   0;

                var shuffledList    =   _.shuffle(data['subsonic-response'].playlist.entry).slice(0, 10);

                // console.log(shuffledList[0])
                for(songIndex; songIndex < shuffledList.length; songIndex++){
                    shuffledList[songIndex].backgroundImage  =    null;
                    this.currentPlayList.push(shuffledList[songIndex])
                }
                // console.log(this.currentPlayList)
                this.chosenPlaylist     =   subPlaylist
                this.currentScreen      =   'mood-playlist'
            })
    }

    @action setDimensions(ox, oy, width, height, px, py) {
        this.componentsState.SongsSwiper.coverWidth     =   width;
        this.componentsState.SongsSwiper.coverHeight    =   height;
    }

    @action _appStateChange(currentAppState) {
        switch (currentAppState) {
            case 'active':
                break;

            case 'background':

                break;
        }
    }

    constructor(serverData, allMethodsParams) {
        this.serverData             =   serverData;
        this.allMethodsParams       =   allMethodsParams;
        this.progressBarInterval    =   null;
        this.player                 =   null;
        this.PushNotification       =   PushNotification;

        KeepAwake.activate();

        this.PushNotification.configure({
            onRegister: function(token) {
                console.log( 'TOKEN:', token );
            },
            onNotification: function(notification) {
                // console.log( 'NOTIFICATION:', notification );
            },
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },
            popInitialNotification: true,
            requestPermissions: true,
        });


        BackAndroid.addEventListener('hardwareBackPress', () => {
            switch (this.currentScreen) {
                case 'home':
                    this.exitApp()
                    return false;
                    break;

                case 'random-playlist':
                    this.currentScreen = 'main';
                    return true;
                    break;

                case 'mood-playlist':
                    this.currentScreen = 'main';
                    return true;
                    break;
            }
        });

        this.setProgressBar()
    }

    @action runMenuItem(item) {
        this.currentScreen   =   item;
        this.drawer.close()
    }

    @action setBarMenu() {
        this.isSettingsBarOpen    =   !this.isSettingsBarOpen
    }


    @action exitApp() {
        this.currentPlayList = [];
        if(this.player && this.player.stop) this.player.stop();
        PushNotification.cancelAllLocalNotifications();
        KeepAwake.deactivate();
        BackAndroid.exitApp();
    }
}

export default new AppState();