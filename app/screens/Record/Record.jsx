import React, {Component} from 'react';
import {Platform, StyleSheet, Alert, SafeAreaView, View, Text, TouchableOpacity, Button} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'underscore';
import BackgroundTimer from 'react-native-background-timer';
import {Grid, Row, Col} from 'react-native-easy-grid';
import {formatElapsed} from '../../utils/formatting';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cameraNoPermissions: {},
    bottomControls: {
        position: 'absolute',
        bottom: 0,
        display: 'flex',
        width: '100%',
        paddingVertical: 40,
        alignItems: 'center',
    },
    camera: {
        flex: 1,
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    cameraLoading: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5f5f5f',
    },
    cameraLoadingText: {
        fontSize: 32,
        color: '#fff',
    },
    recordIcon: {
        flex: 1,
        alignSelf: 'center',
    },
    elapsed: {
        fontSize: 30,
        color: '#fff',
    },
    cameraGrid: {
        padding: 16,
    },
    backIcon: {
        color: '#fff',
        fontSize: 40,
        borderRadius: 40,
    },
    topNav: {},
    elapsedText: {
        color: '#fff',
        fontSize: 24,
    },
    backContainer: {},
    settingsIcon: {
        color: '#fff',
        fontSize: 40,
        backgroundColor: '#1f1f1f',
        padding: 6,
        borderRadius: 40,
    },
    settingsContainer: {
        display: 'flex',
        alignItems: 'flex-end',
    },
    pauseContainer: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    pauseIcon: {
        flex: 0,
        backgroundColor: '#1f1f1f99',
        fontSize: 60,
        borderRadius: 50,
        color: '#fff',
    },
    recordContainer: {
        display: 'flex',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    recordIcon: {
        backgroundColor: '#1f1f1f99',
        fontSize: 100,
        borderRadius: 50,
        color: '#fff',
    },
    mapContainer: {},
    map: {
        flex: 1,
        backgroundColor: '#124dcc66',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapExpandIcon: {
        fontSize: 28,
        position: 'absolute',
        top: 4,
        right: 4,
        color: '#fff',
    },
});

const CAMERA_FRONT = RNCamera.Constants.Type.front;
const CAMERA_BACK = RNCamera.Constants.Type.back;

const CameraNoPermissions = (
    <Text style={styles.cameraNoPermissions}>
        Camera access was not granted. Please go to your phone's settings and allow camera access.
    </Text>
);

const icons = {
    record: <Icon name="record" size={60} color={'#fff'} />,
};

const parseRatio = (str) => {
    let [p1, p2] = str.split(':').map((s) => parseInt(s));
    return p1 / p2;
};

const getCameraType = (type) => {
    if (type === 'AVCaptureDeviceTypeBuiltInTelephotoCamera') return 'zoomed';
    if (type === 'AVCaptureDeviceTypeBuiltInUltraWideCamera') return 'wide';
    return 'normal';
};
// BackgroundTimer.runBackgroundTimer(() => {
// }, 3000);

class Camera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cameraReady: false,
            cameraIds: null,
            cameraType: CAMERA_BACK,
            cameraId: null,
            aspectRatioStr: '4:3',
            aspectRatio: parseRatio('4:3'),
            recording: false,
            capturing: false,
            flashMode: 'off',
            elapsed: 0,
        };
    }
    componentDidMount() {
        this.mounted = true;
    }
    componentWillUnmount() {
        this.mounted = false;
        this.stopVideo();
    }
    onCameraStatusChange = (s) => {
        if (s.cameraStatus === 'READY') {
            let audioDisabled = s.recordAudioPermissionStatus === 'NOT_AUTHORIZED';
            this.setState({audioDisabled: audioDisabled}, async () => {
                let ids = [];
                let cameraId = null;
                try {
                    ids = await this.camera.getCameraIdsAsync();
                    ids = ids.map((d) => {
                        d.cameraType = getCameraType(d.deviceType);
                        return d;
                    });
                    if (ids.length) {
                        cameraId = ids[0].id;
                        for (let c of ids)
                            if (c.type === 'BACK_TYPE') {
                                cameraId = c.id;
                                break;
                            }
                    }
                } catch (error) {
                    console.error('Failed to get camera ids', error.message || error);
                }
                ids = _.sortBy(ids, (v) => (v.type === CAMERA_FRONT ? 0 : 1));
                this.setState({cameraIds: ids, cameraId: cameraId});
            });
        } else {
            if (this.state.cameraReady) {
                this.setState({cameraReady: false});
            }
        }
    };
    onCameraReady = () => {
        if (!this.state.cameraReady) {
            this.setState({cameraReady: true});
        }
    };
    onCameraMountError = () => {
        setTimeout(() => {
            Alert.alert('Error', 'Camera start failed.');
        }, 150);
    };
    resetRecordingTimer() {
        if (this._recordingTimer) {
            BackgroundTimer.clearInterval(this._recordingTimer);
            this.recordingTimer = null;
        }
        this.setState({elapsed: 0});
    }
    startVideo = () => {
        if (this.camera && !this.state.recording) {
            this.state.recording = true;

            // TODO: Decide quality
            const options = {
                quality: '720p',
            };
            this.setState({recording: true, elapsed: -1}, async () => {
                let result = null;
                try {
                    result = await this.camera.recordAsync(options);
                } catch (error) {
                    console.warn('Video record fail', error.message, error);
                }
                if (result) {
                    Alert.alert('Video recorded', JSON.stringify(result));
                }
                setTimeout(() => {
                    this.setState({recording: false});
                }, 500);
                this.resetRecordingTimer();
            });
        }
    };
    pauseTimer = () => {
        if (this._recordingTimer) {
            BackgroundTimer.clearInterval(this._recordingTimer);
            this.recordingTimer = null;
        }
    };
    resumeTimer = () => {
        if (this.state.recording) {
            this.setState({elapsed: 0});
            this._recordingTimer = BackgroundTimer.setInterval(() => {
                this.setState({elapsed: this.state.elapsed + 1});
            }, 1000);
        }
    };
    pauseVideo = () => {
        if (this.camera && this.state.recording) {
            const {cameraPaused} = this.state;
            this.setState({cameraPaused: !cameraPaused}, async () => {
                console.log(cameraPaused);
                if (cameraPaused) {
                    console.log('Resuming');
                    this.camera.resumePreview();
                    this.pauseTimer();
                } else {
                    console.log('Pausing');
                    this.camera.pausePreview();
                }
            });
        }
    };
    stopVideo = () => {
        if (this.camera && this.state.recording) {
            this.camera.stopRecording();
        }
    };
    onRecordingStart = () => {
        this.reportRequestPrompt = true;
        this.resetRecordingTimer();
        if (this.state.recording) {
            this.setState({elapsed: 0});
            this._recordingTimer = BackgroundTimer.setInterval(() => {
                this.setState({elapsed: this.state.elapsed + 1});
            }, 1000);
        }
    };
    onRecordingEnd = () => {
        this.reportRequestPrompt = true;
        this.resetRecordingTimer();
    };
    handleStartRecording = () => {
        // TODO: Add location recording in this method
        this.startVideo();
    };
    handlePauseRecording = () => {
        // TODO: Add location pause in this method
        // TODO: Work on pause methods
        // this.pauseVideo();
    };
    handleStopRecording = () => {
        // TODO: Add location stop in this method
        this.stopVideo();
    };
    handleClickSettings = () => {
        if (!this.state.recording) console.log('Open settings');
    };
    handleClickBack = () => {
        if (!this.state.recording) console.log('Go back');
    };
    handleFlash = (mode) => () => {
        // TODO: It's for video, so we only need 'torch' & 'off'
        this.setState({flashMode: mode});
    };
    render() {
        let {cameraId, cameraIds, elapsed, recording, cameraType, flashMode} = this.state;
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={(ref) => {
                        this.camera = ref;
                    }}
                    style={styles.camera}
                    type={cameraType}
                    cameraId={cameraId}
                    flashMode={flashMode}
                    onRecordingStart={this.onRecordingStart}
                    onRecordingEnd={this.onRecordingEnd}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    onStatusChange={this.onCameraStatusChange}
                    onCameraReady={this.onCameraReady}
                    onMountError={this.onCameraMountError}
                    useNativeZoom={true}
                    pendingAuthorizationView={
                        <SafeAreaView style={styles.cameraLoading}>
                            <Text style={styles.cameraLoadingText}>Loading</Text>
                        </SafeAreaView>
                    }
                    notAuthorizedView={<View>{CameraNoPermissions}</View>}>
                    <Grid style={styles.cameraGrid}>
                        <Row size={14}>
                            {recording ? (
                                <Row>
                                    <Col>
                                        <Text style={styles.elapsedText}>
                                            {elapsed > -1 ? formatElapsed(elapsed) : '00:00'}
                                        </Text>
                                    </Col>
                                    <Col size={1} style={styles.settingsContainer}>
                                        {/* TODO: Add dropdown instead of flash button */}
                                        {flashMode === 'off' ? (
                                            <Icon
                                                name="flash-off"
                                                style={styles.settingsIcon}
                                                onPress={this.handleFlash('torch')}
                                            />
                                        ) : (
                                            <Icon name="flash" style={styles.settingsIcon} onPress={this.handleFlash('off')} />
                                        )}
                                    </Col>
                                </Row>
                            ) : (
                                <Row>
                                    <Col size={1} style={styles.backContainer}>
                                        <Icon name="arrow-left" style={styles.backIcon} onPress={this.handleClickBack} />
                                    </Col>
                                    <Col size={1} style={styles.settingsContainer}>
                                        <Icon
                                            name="cog-outline"
                                            style={styles.settingsIcon}
                                            onPress={this.handleClickSettings}
                                        />
                                    </Col>
                                </Row>
                            )}
                        </Row>
                        <Row size={5} style={{alignItems: 'center'}}>
                            <Col size={2} style={styles.pauseContainer}>
                                {recording && (
                                    <Icon
                                        name="pause-circle-outline"
                                        style={styles.pauseIcon}
                                        onPress={this.handlePauseRecording}
                                    />
                                )}
                            </Col>
                            <Col size={2} style={styles.recordContainer}>
                                {recording ? (
                                    <Icon
                                        style={styles.recordIcon}
                                        name="stop-circle-outline"
                                        onPress={this.handleStopRecording}
                                    />
                                ) : (
                                    <Icon style={styles.recordIcon} name="circle-outline" onPress={this.handleStartRecording} />
                                )}
                            </Col>
                            <Col size={2} style={styles.mapContainer}>
                                {recording && (
                                    <View style={styles.map}>
                                        <Icon name="arrow-expand" style={styles.mapExpandIcon} />
                                        <Text style={{color: '#fff'}}> Map</Text>
                                    </View>
                                )}
                            </Col>
                        </Row>
                    </Grid>
                </RNCamera>
            </View>
        );
    }
}

class Record extends Component {
    render() {
        return (
            <View style={{flex: 1}}>
                <Camera />
            </View>
        );
    }
}

export default Record;
