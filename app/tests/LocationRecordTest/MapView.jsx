import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Draggable from 'react-native-draggable';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default (props) => {

    if (props.timerInterval === null) return null;

    let [opacity, setOpacity] = useState(0);

    let onPressIn = () => {
        setOpacity(1)
        setTimeout(() => {
            setOpacity(0)
        }, 3000)
    }

    return (
        <Draggable x={10} y={10} onPressIn={onPressIn}>
            <View style={{ height: 200, width: 160 }}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{ ...StyleSheet.absoluteFillObject }}
                    region={{
                        latitude: props.lat,
                        longitude: props.lng,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: props.lat,
                            longitude: props.lng
                        }}
                    />
                </MapView>
                <View style={{ position: 'absolute', backgroundColor: '#0000003b', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', opacity }}>
                    <TouchableOpacity>
                        <Icon name="arrow-expand-all" size={30} color={'#fff'} />
                    </TouchableOpacity>
                </View>
            </View>
        </Draggable>
    )
}