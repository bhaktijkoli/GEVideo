import React, { useRef, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Grid, Row, Col } from 'react-native-easy-grid'
import * as Animatable from 'react-native-animatable';
import { formatElapsed } from '../../utils/formatting';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from './../../styles/colors'


const styles = StyleSheet.create({
    controlsContainer: {
        width: '100%',
        flexDirection: 'column',
        position: 'absolute',
        alignItems: 'center',
        bottom: 0,
    },
    controls: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#000000c0',
        paddingVertical: 20,
        paddingHorizontal: 30
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    record: {
        backgroundColor: 'transparent',
        width: 64,
        height: 64,
        borderRadius: 64 / 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF'
    },
    recordInner: {
        backgroundColor: colors.danger,
        width: 52,
        height: 52,
        borderRadius: 52 / 2
    },
    button: {
        backgroundColor: '#969696',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 52,
        height: 52,
        borderRadius: 52 / 2
    },
    time: {
        color: '#FFF',
        fontSize: 16,
        backgroundColor: '#000000c0',
        paddingVertical: 2,
        paddingHorizontal: 10,
        borderRadius: 8,
    }
})

export default MainControls = (props) => {

    let controlsRef = useRef()
    let recordRef = useRef()

    let onPressRecord = () => {
        if (props.recording === true) {
            controlsRef.current.transitionTo({ backgroundColor: '#000000c0' }, 300)
            recordRef.current.transitionTo(styles.recordInner, 300)
            props.onStopRecord();
        } else {
            controlsRef.current.transitionTo({ backgroundColor: 'transparent' }, 300)
            recordRef.current.transitionTo({ borderRadius: 0, width: 26, height: 26 }, 300)
            props.onStartRecord();
        }
    }

    return (
        <View style={styles.controlsContainer}>
            {
                props.recording === true ? <Text style={styles.time}>{formatElapsed(props.elapsed)}</Text> : null
            }
            <Animatable.View ref={controlsRef} style={styles.controls}>
                <Col style={[styles.center]}>
                    <View style={styles.button}>

                    </View>
                </Col>
                <Col style={styles.center}>
                    <TouchableOpacity style={styles.record} activeOpacity={0.8} onPress={onPressRecord}>
                        <Animatable.View ref={recordRef} style={styles.recordInner}></Animatable.View>
                    </TouchableOpacity>
                </Col>
                <Col style={styles.center}>
                    <TouchableOpacity style={[styles.button, { backgroundColor: '#9696966b' }]}>
                        <Icon name="rotate-3d-variant" size={32} color="#FFF" />
                    </TouchableOpacity>
                </Col>
            </Animatable.View >
        </View>
    )
}