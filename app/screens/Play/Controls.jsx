import React from 'react';
import {Dimensions, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Grid, Row, Col} from 'react-native-easy-grid';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CONTROL_HEIGHT = 100;

function Controls({
    locked = false,
    paused = false,
    height,
    style,
    onPlayPause,
    onLockControls,
    onSeekMinus,
    onSeek,
    onSeekPlus,
}) {
    const containerStyle = {...style};
    if (height !== null) {
        containerStyle.height = height;
    }
    const styles = StyleSheet.create({
        controls: {
            height: 'auto',
            alignItems: 'center',
            marginBottom: 12,
        },
        seek: {
            height: height ? height - 110 : 30,
        },
        controlItem: {
            backgroundColor: '#5522ee',
            borderRadius: 40,
            alignSelf: 'center',
            width: 45,
            height: 45,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        },
        controlIcon: {
            alignContent: 'center',
            color: '#fff',
            fontSize: 30,
        },
        playBtn: {
            width: 60,
            height: 60,
            borderWidth: 2,
            borderColor: '#fff',
        },
    });
    const onRewind = () => {};
    const onFastForward = () => { };
    const openOptionsMenu = () => {
        // TODO: Options component
    }
    return (
        <View style={containerStyle}>
            <Grid>
                <Row style={styles.seek}>{/* <Text>Hehlo</Text> */}</Row>
                <Row style={styles.controls}>
                    <Col>
                        <TouchableOpacity onPress={onPlayPause}>
                            <View style={styles.controlItem}>
                                <Icon name={locked ? 'lock' : 'lock-open'} style={styles.controlIcon} />
                            </View>
                        </TouchableOpacity>
                    </Col>
                    <Col>
                        <TouchableOpacity onPress={onRewind}>
                            <View style={styles.controlItem}>
                                <Icon name="rewind" style={styles.controlIcon} />
                            </View>
                        </TouchableOpacity>
                    </Col>
                    <Col>
                        <TouchableOpacity onPress={onPlayPause} delayPressOut={100}>
                            <View style={[styles.controlItem, styles.playBtn]}>
                                <Icon name={paused ? 'play' : 'pause'} style={[styles.controlIcon, {fontSize: 50}]} />
                            </View>
                        </TouchableOpacity>
                    </Col>
                    <Col>
                        <TouchableOpacity onPress={onFastForward}>
                            <View style={styles.controlItem}>
                                <Icon name="fast-forward" style={styles.controlIcon} />
                            </View>
                        </TouchableOpacity>
                    </Col>
                    <Col>
                        <TouchableOpacity onPress={openOptionsMenu}>
                            <View style={styles.controlItem}>
                                <Icon name="dots-vertical" style={styles.controlIcon} />
                            </View>
                        </TouchableOpacity>
                    </Col>
                </Row>
            </Grid>
        </View>
    );
}

export default Controls;
