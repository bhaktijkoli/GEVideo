import React, { Component } from 'react';
import { Platform, StyleSheet, Alert, SafeAreaView, View, Text, TouchableOpacity, Button } from 'react-native';
import { RNCamera } from 'react-native-camera';
import _ from 'underscore';
import Geolocation from 'react-native-geolocation-service';
import BackgroundTimer from 'react-native-background-timer';
import moment from 'moment';
import MainControls from './MainControls';
import SideControls from './SideControls';
import RNFS from 'react-native-fs';
import kml from './../../utils/kml';
import directory from './../../utils/directory';

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
    }
});

const CAMERA_FRONT = RNCamera.Constants.Type.front;
const CAMERA_BACK = RNCamera.Constants.Type.back;

const CameraNoPermissions = (
    <Text style={styles.cameraNoPermissions}>
        Camera access was not granted. Please go to your phone's settings and allow camera access.
    </Text>
);

const parseRatio = (str) => {
    let [p1, p2] = str.split(':').map((s) => parseInt(s));
    return p1 / p2;
};

const getCameraType = (type) => {
    if (type === 'AVCaptureDeviceTypeBuiltInTelephotoCamera') return 'zoomed';
    if (type === 'AVCaptureDeviceTypeBuiltInUltraWideCamera') return 'wide';
    return 'normal';
};

class Record extends Component {
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
            startTime: null,
            locations: [],
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
            this.setState({ audioDisabled: audioDisabled }, async () => {
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
                this.setState({ cameraIds: ids, cameraId: cameraId });
            });
        } else {
            if (this.state.cameraReady) {
                this.setState({ cameraReady: false });
            }
        }
    };
    onCameraReady = () => {
        if (!this.state.cameraReady) {
            this.setState({ cameraReady: true });
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
        this.setState({ elapsed: 0 });
    }
    startVideo = () => {
        if (this.camera && !this.state.recording) {
            this.state.recording = true;

            // TODO: More Options
            const options = {
                quality: '720p',
            };
            this.setState({ recording: true, elapsed: -1 }, async () => {
                let result = null;
                try {
                    result = await this.camera.recordAsync(options);
                } catch (error) {
                    console.warn('Video record fail', error.message, error);
                }
                if (result) {
                    let file = result.uri.replace('file://', '');
                    let dest = directory.path("GE" + moment().format('YYMMDDHHmmss') + '.mp4');
                    RNFS.copyFile(file, dest)
                    RNFS.writeFile(dest + ".kml", kml.kmlDocument(this.state.locations))
                    Alert.alert('Video recorded', JSON.stringify(result));
                }
                setTimeout(() => {
                    this.setState({ recording: false });
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
            this.setState({ elapsed: 0 });
            this._recordingTimer = BackgroundTimer.setInterval(() => {
                this.setState({ elapsed: this.state.elapsed + 1 });
            }, 1000);
        }
    };
    pauseVideo = () => {
        if (this.camera && this.state.recording) {
            const { cameraPaused } = this.state;
            this.setState({ cameraPaused: !cameraPaused }, async () => {
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
            this.setState({ elapsed: 0, startTime: moment(), locations: [] });
            this._recordingTimer = BackgroundTimer.setInterval(() => {
                this.setState({ elapsed: moment().diff(this.state.startTime, 'seconds') });

                Geolocation.getCurrentPosition(
                    info => {
                        let { locations } = this.state
                        locations.push({
                            alt: info.coords.altitude,
                            lat: info.coords.latitude,
                            lng: info.coords.longitude,
                            speed: info.coords.speed,
                            heading: info.coords.heading,
                        })
                        this.setState({ locations });
                    },
                    error => {
                        console.log(error)
                    },
                    { enableHighAccuracy: true }
                );

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
    handleClickBack = () => {
        if (!this.state.recording) console.log('Go back');
    };
    handleFlash = (mode) => {
        this.setState({ flashMode: mode });
    }
    render() {
        let { cameraId, cameraType, flashMode } = this.state;
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
                    <SideControls onFlashToggle={this.handleFlash} {...this.state} />
                    <MainControls onStartRecord={this.handleStartRecording} onStopRecord={this.handleStopRecording} {...this.state} />

                </RNCamera>
            </View>
        );
    }
}

export default Record;
