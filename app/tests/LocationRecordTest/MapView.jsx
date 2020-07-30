import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Draggable from 'react-native-draggable';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default (props) => {

    if (props.timerInterval === null) return null;
    if (props.lat === 0 || props.lng === 0) return null;

    const [lat, setLat] = useState(props.lat);
    const [lng, setLng] = useState(props.lng);

    const markerRef = useRef(null);

    if (lat !== props.lat || lng !== props.lng) {
        markerRef.current.animateMarkerToCoordinate({ latitude: props.lat, longitude: props.lng })
    }

    return (
        <Draggable x={10} y={10}>
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
                    zoomEnabled={true}
                >
                    <Marker
                        ref={markerRef}
                        coordinate={{
                            latitude: lat,
                            longitude: lng
                        }}
                    />
                </MapView>
            </View>
        </Draggable>
    )
}