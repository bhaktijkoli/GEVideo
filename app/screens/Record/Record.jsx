import React, {Component} from 'react';
import {Platform, StyleSheet, Alert, SafeAreaView, View, Text} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'underscore';

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
    recordIcon: {
        flex: 1,
        alignSelf: 'center',
    },
    elapsed: {
        fontSize: 30,
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
            elapsed: 0,
        };
    }
    componentDidMount() {
        this.mounted = true;
        // TODO: Remove this, add buttons
        setTimeout(() => {
            this.startVideo();
            setTimeout(() => {
                this.stopVideo();
            }, 5000);
        }, 2000);
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
                    console.error('Failed to get camera ids', err.message || err);
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
            clearInterval(this._recordingTimer);
            this.recordingTimer = null;
        }
    }
    startVideo = () => {
        console.log('Started');
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
                    console.warn('Video record fail', err.message, err);
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
    stopVideo = () => {
        console.log('Stopped');
        if (this.camera && this.state.recording) {
            this.camera.stopRecording();
        }
    };
    onRecordingStart = () => {
        this.reportRequestPrompt = true;
        this.resetRecordingTimer();
        if (this.state.recording) {
            this.setState({elapsed: 0});
            this._recordingTimer = setInterval(() => {
                this.setState({elapsed: this.state.elapsed + 1});
            }, 1000);
        }
    };
    onRecordingEnd = () => {
        this.reportRequestPrompt = true;
        this.resetRecordingTimer();
    };
    render() {
        let {cameraId, cameraIds, elapsed, recording, cameraType} = this.state;
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={(ref) => {
                        this.camera = ref;
                    }}
                    style={styles.camera}
                    type={cameraType}
                    cameraId={cameraId}
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
                            <Text>Loading...</Text>
                        </SafeAreaView>
                    }
                    notAuthorizedView={<View>{CameraNoPermissions}</View>}>
                    <View style={styles.bottomControls}>
                        {recording && (
                            <View>
                                {/* TODO: Formatting timer */}
                                <Text style={styles.elapsed}>{elapsed !== -1 ? elapsed + 1 + 's' : 'Preparing...'}</Text>
                            </View>
                        )}
                        {recording ? (
                            <View style={styles.recordIcon}>
                                <Icon name="stop-circle-outline" size={80} color="red" />
                            </View>
                        ) : (
                            <View style={styles.recordIcon}>
                                <Icon name="circle-outline" size={80} color="#fff" />
                            </View>
                        )}
                    </View>
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
