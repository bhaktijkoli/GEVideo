import React, { useRef, useState } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView from './MapView';

const styles = StyleSheet.create({
    controls: {
        flexDirection: 'column',
        position: 'absolute',
        top: 40,
        right: 20,
    },
    button: {
        backgroundColor: '#000000b0',
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 44,
        borderRadius: 42 / 2,
        marginBottom: 20
    }
})

export default SideControls = (props) => {
    if (props.recording === false) return null;

    let onPressFlash = () => {
        if (props.flashMode === 'off') {
            props.onFlashToggle('torch')
        } else {
            props.onFlashToggle('off')
        }
    }

    return (
        <React.Fragment>

            <View style={styles.controls}>
                <Animatable.View animation="fadeIn">
                    <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onPressFlash}>
                        <Icon name={props.flashMode === 'off' ? "flash-off" : "flash"} size={26} color="#FFF" />
                    </TouchableOpacity>
                </Animatable.View>
                <Animatable.View animation="fadeIn">
                    <TouchableOpacity style={styles.button} activeOpacity={0.8}>
                        <Icon name="map-marker-radius" size={26} color="#FFF" />
                    </TouchableOpacity>
                </Animatable.View>
            </View>
            <MapView {...props} />
        </React.Fragment>
    )
}