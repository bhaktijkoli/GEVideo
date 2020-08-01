import React, {Component} from 'react';
import {View, StyleSheet, Button, Text, Dimensions, PanResponder, Animated} from 'react-native';
import RNVideo from 'react-native-video';
import SlidingPanel from 'rn-sliding-up-panel';
import Controls from './Controls';
import {SafeAreaView} from 'react-native-safe-area-context';
import Video from './Video';
import TopControls from './TopControls';

const {height, width} = Dimensions.get('window');
const CONTROLS_HEIGHT = 140; // Includes the sliding bar
const DRAWER_DEFAULT_TOP = 0.4 * height + CONTROLS_HEIGHT; // Middle snapping
const SLIDE_TRIGGER_HEIGHT = 12; // Invisible padding to drag
const DRAWER_DEFAULT_BOTTOM = 16 + SLIDE_TRIGGER_HEIGHT; // Some space for it to be draggable

const styles = StyleSheet.create({
    playerContainer: {
        flex: 1,
        backgroundColor: '#ffffff00',
    },
    videoContainer: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000',
        paddingTop: 12,
    },
    controlsContainer: {
        height: CONTROLS_HEIGHT,
        display: 'flex',
        flexDirection: 'row',
    },
    mapContainer: {
        flexGrow: 1,
        backgroundColor: '#777',
        borderRadius: 12,
        marginTop: 12,
    },
    slidingPanelTop: {
        height: SLIDE_TRIGGER_HEIGHT,
        backgroundColor: '#ffffff00',
    },
    slidingPanel: {
        flex: 1,
        backgroundColor: '#1f1f1f',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingHorizontal: 12,
        paddingBottom: 12,
    },
    dragBox: {
        alignSelf: 'flex-start',
        alignContent: 'center',
        backgroundColor: '#fff',
        width: width * 0.15,
        height: 4,
        borderRadius: 4,
        marginVertical: 6,
    },
    topOptions: {
        height: 150,
        width: width,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    divider: {
        marginHorizontal: 60,
        height: 1,
        backgroundColor: '#6c6c6c',
    },
});

class Play extends Component {
    slidePanel = null;
    _draggedPanelValue = new Animated.Value(CONTROLS_HEIGHT + SLIDE_TRIGGER_HEIGHT);
    videoHeight = Animated.subtract(height - 16, this._draggedPanelValue);
    player = null;
    constructor(props) {
        super(props);
        this.state = {
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-weeds-waving-in-the-breeze-1178-large.mp4',
            paused: false,
            repeat: true,
            muted: false,
            volume: 1,
            videoHeight: height,
        };
    }
    onExport = () => {};
    onShare = () => {};
    onOpenInfo = () => {};
    onDelete = () => {};
    onToggleDarkMode = () => {};
    onSeek = () => {};
    onSeekPlus = () => {};
    onSeekMinus = () => {};
    onPlayPause = () => {
        this.setState({paused: !this.state.paused});
    };
    onLockControls = () => {};
    onToggleOptions = () => {};
    render() {
        const top = DRAWER_DEFAULT_TOP;
        const bottom = DRAWER_DEFAULT_BOTTOM;
        return (
            <View style={styles.playerContainer}>
                <Animated.View style={[styles.videoContainer, {height: this.videoHeight}]}>
                    <Video
                        handleRef={(ref) => (this.player = ref)}
                        repeat={this.state.repeat}
                        muted={this.state.muted}
                        paused={this.state.paused}
                        source={{uri: this.state.videoUrl}}
                    />
                    <View style={styles.topOptions}>
                        <TopControls
                            onExport={this.onExport}
                            onShare={this.onShare}
                            onOpenInfo={this.onOpenInfo}
                            onDelete={this.onDelete}
                            onToggleDarkMode={this.onToggleDarkMode}
                            speed={'2 km/h'}
                        />
                    </View>
                    {/* <VideoPlayer source={{uri: this.state.videoUrl}} navigator={this.props.navigator} /> */}
                </Animated.View>
                <SlidingPanel
                    containerStyle={{backgroundColor: '#000'}}
                    backdropStyle={{backgroundColor: 'transparent'}}
                    ref={(c) => (this.slidePanel = c)}
                    draggableRange={{top, bottom}}
                    snappingPoints={[DRAWER_DEFAULT_BOTTOM, CONTROLS_HEIGHT]}
                    animatedValue={this._draggedPanelValue}
                    height={height + CONTROLS_HEIGHT + SLIDE_TRIGGER_HEIGHT}
                    friction={1}
                    showBackdrop={false}
                    onMomentumDragEnd={this.adjustVideoHeight}>
                    <React.Fragment>
                        <View style={styles.slidingPanelTop} />
                        <Animated.View style={styles.slidingPanel}>
                            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                                <View style={styles.dragBox} />
                            </View>
                            {/* TODO: External Controls */}
                            <Controls
                                style={styles.controlsContainer}
                                paused={this.state.paused}
                                onPlayPause={this.onPlayPause}
                                onLockControls={this.onLockControls}
                                onSeekMinus={this.onSeekMinus}
                                onSeek={this.onSeek}
                                onSeekPlus={this.onSeekPlus}
                            />
                            <View style={styles.divider} />
                            <View style={styles.mapContainer}></View>
                        </Animated.View>
                    </React.Fragment>
                </SlidingPanel>
            </View>
        );
    }
    // componentDidMount() {}
    // componentWillUnmount() {}
}

export default Play;
