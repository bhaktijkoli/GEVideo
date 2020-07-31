import React, { useState, useRef } from 'react';
import { StyleSheet } from 'react-native';
import Draggable from 'react-native-draggable';
import * as Animatable from 'react-native-animatable';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default (props) => {

    if (props.recording === null) return null;
    if (props.locations.length === 0) return null;

    const cameraRef = useRef(null);

    if (cameraRef.current !== null) {
        let location = props.locations[props.locations.length - 1]
        cameraRef.current.animateCamera({
            center: {
                latitude: location.lat,
                longitude: location.lng,
            },
        })
    }
    return (
        <Draggable x={10} y={10}>
            <Animatable.View animation="fadeInLeft" style={{ height: 200, width: 160 }}>
                <MapView
                    ref={cameraRef}
                    provider={PROVIDER_GOOGLE}
                    style={{ ...StyleSheet.absoluteFillObject }}
                    showsUserLocation={true}
                    userLocationUpdateInterval={500}
                    userLocationFastestInterval={300}
                    followsUserLocation={true}
                    showsMyLocationButton={true}
                    loadingEnabled={true}
                    initialCamera={{
                        center: {
                            latitude: props.locations[0].lat,
                            longitude: props.locations[0].lng,
                        },
                        altitude: props.locations[0].alt,
                        heading: props.locations[0].heading,
                        zoom: 16,
                        pitch: 10,
                    }}
                    zoomEnabled={true}
                >

                </MapView>
            </Animatable.View>
        </Draggable>
    )
}

{/* <Marker
    ref={markerRef}
    coordinate={{
        latitude: props.locations[0].lat,
        longitude: props.locations[0].lng,
    }}
/> */}