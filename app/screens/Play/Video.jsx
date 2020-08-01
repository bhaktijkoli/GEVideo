import React, {Component} from 'react';
import {View, Animated, StyleSheet, ActivityIndicator} from 'react-native';
import RNVideo from 'react-native-video';
import Loader from '../../components/Loader';

const styles = StyleSheet.create({
    playerContainer: {
        overflow: 'hidden',
        backgroundColor: '#000',
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'space-between',
    },
    playerVideo: {
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
});

class Video extends Component {
    constructor(props) {
        super(props);
        this.state = {
            volume: this.props.volume || 1,
            paused: this.props.paused,
            muted: this.props.muted || this.props.volume === 0,
            repeat: this.props.repeat,
            rate: this.props.rate,
            loading: false,
            seeking: false,
            currentTime: 0,
            error: false,
            duration: 0,
        };

        this.options = {
            playWhenInactive: false,
            playInBackground: false,
            title: this.props.title,
        };

        this.events = {
            onError: this._onError.bind(this),
            onBack: this.props.onBack || this._onBack.bind(this),
            onScreenTouch: this.props.onScreenTouch,
            onLoadStart: this._onLoadStart.bind(this),
            onLoad: this._onLoad.bind(this),
            setControlTimeout: this.props.setControlTimeout,
            clearControlTimeout: this.props.clearControlTimeout,
        };
    }
    _onLoad() {
        let state = this.state;
        state.duration = data.duration;
        state.loading = false;
        this.setState(state);
        if (typeof this.props.onLoad === 'function') {
            this.props.onLoad(...arguments);
        }
    }
    _onBack() {
        if (this.props.navigator && this.props.navigator.pop) {
            this.props.navigator.pop();
        }
    }
    _onError() {
        let state = this.state;
        state.error = true;
        state.loading = false;
        this.setState(state);
    }
    _onLoadStart() {
        let state = this.state;
        state.loading = true;
        this.setState(state);
        if (typeof this.props.onLoadStart === 'function') {
            this.props.onLoadStart(...arguments);
        }
    }
    renderLoader = () => {
        console.log(this.state.loading);
        if (this.state.loading) {
            console.log('loading');
            return <Loader />;
        }
        return null;
    };
    renderSeekbar() {
        return (
            <View style={styles.seekbar.container} collapsable={false} {...this.player.seekPanResponder.panHandlers}>
                <View
                    style={styles.seekbar.track}
                    onLayout={(event) => (this.player.seekerWidth = event.nativeEvent.layout.width)}
                    pointerEvents={'none'}>
                    <View
                        style={[
                            styles.seekbar.fill,
                            {
                                width: this.state.seekerFillWidth,
                                backgroundColor: this.props.seekColor || '#FFF',
                            },
                        ]}
                        pointerEvents={'none'}
                    />
                </View>
                <View style={[styles.seekbar.handle, {left: this.state.seekerPosition}]} pointerEvents={'none'}>
                    <View
                        style={[styles.seekbar.circle, {backgroundColor: this.props.seekColor || '#FFF'}]}
                        pointerEvents={'none'}
                    />
                </View>
            </View>
        );
    }
    seekTo(time = 0) {
        let state = this.state;
        state.currentTime = time;
        this.player.ref.seek(time);
        this.setState(state);
    }
    calculateTimeFromSeekerPosition() {
        const percent = this.state.seekerPosition / this.player.seekerWidth;
        return this.state.duration * percent;
    }
    setSeekerPosition(position = 0) {
        let state = this.state;
        position = this.constrainToSeekerMinMax(position);
        state.seekerFillWidth = position;
        state.seekerPosition = position;

        if (!state.seeking) state.seekerOffset = position;
        this.setState(state);
    }
    initSeekPanResponder() {
        this.seekPanResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                let state = this.state;
                this.clearControlTimeout();
                const position = evt.nativeEvent.locationX;
                this.setSeekerPosition(position);
                state.seeking = true;
                state.originallyPaused = state.paused;
                state.scrubbing = false;
                if (this.player.scrubbingTimeStep > 0) {
                    state.paused = true;
                }
                this.setState(state);
            },

            onPanResponderMove: (evt, gestureState) => {
                const position = this.state.seekerOffset + gestureState.dx;
                this.setSeekerPosition(position);
                let state = this.state;

                if (this.player.scrubbingTimeStep > 0 && !state.loading && !state.scrubbing) {
                    const time = this.calculateTimeFromSeekerPosition();
                    const timeDifference = Math.abs(state.currentTime - time) * 1000;

                    if (time < state.duration && timeDifference >= this.player.scrubbingTimeStep) {
                        state.scrubbing = true;

                        this.setState(state);
                        setTimeout(() => {
                            this.player.ref.seek(time, this.player.scrubbingTimeStep);
                        }, 1);
                    }
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                const time = this.calculateTimeFromSeekerPosition();
                let state = this.state;
                if (time >= state.duration && !state.loading) {
                    state.paused = true;
                    this.events.onEnd();
                } else if (state.scrubbing) {
                    state.seeking = false;
                } else {
                    this.seekTo(time);
                    this.setControlTimeout();
                    state.paused = state.originallyPaused;
                    state.seeking = false;
                }
                this.setState(state);
            },
        });
    }

    render() {
        return (
            <View style={styles.playerContainer}>
                <RNVideo
                    {...this.props}
                    ref={this.props.handleRef}
                    style={styles.playerVideo}
                    volume={this.state.volume}
                    paused={this.props.paused}
                    muted={this.state.muted}
                    repeat={this.state.repeat}
                    onSeek={this.state.onSeek}
                    rate={this.state.rate}
                    source={this.props.source}
                    resizeMode={'contain'}
                />
                {this.renderLoader()}
                <ActivityIndicator size={'large'} />
            </View>
        );
    }
}

export default Video;
