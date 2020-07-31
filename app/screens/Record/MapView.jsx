import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Draggable from 'react-native-draggable';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default (props) => {

    if (props.recording === null) return null;
    if (props.locations.length === 0) return null;

    const markerRef = useRef(null);

    if (markerRef.current !== null) {
        let location = props.locations[props.locations.length - 1]
        markerRef.current.animateMarkerToCoordinate({ latitude: location.lat, longitude: location.lng })
    }
    return (
        <Draggable x={10} y={10}>
            <View style={{ height: 200, width: 160 }}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{ ...StyleSheet.absoluteFillObject }}
                    region={{
                        latitude: props.locations[0].lat,
                        longitude: props.locations[0].lng,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                    zoomEnabled={true}
                >
                    <Marker
                        ref={markerRef}
                        coordinate={{
                            latitude: props.locations[0].lat,
                            longitude: props.locations[0].lng,
                        }}
                    />
                </MapView>
            </View>
        </Draggable>
    )
}