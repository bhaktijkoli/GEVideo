import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from '../../components';
import Geolocation from 'react-native-geolocation-service';
import permission from '../../utils/permission';
import MapView from './MapView';
import BackgroundTimer from 'react-native-background-timer';
import moment from 'moment';
import { formatElapsed } from "../../utils/formatting"

class LocationRecordTest extends Component {

    state = {
        lat: 0,
        lng: 0,
        speed: 0,
        heading: 0,
        elapsed: 0,
        timerInterval: null,
        startTime: null,
        elapsedTime: 0,
    }
    timerInterval = null
    render() {
        let { lat, lng, speed, elapsed, heading, elapsedTime } = this.state;
        return (
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20 }}>Lat: {lat}</Text>
                <Text style={{ fontSize: 20 }}>Lng: {lng}</Text>
                <Text style={{ fontSize: 20 }}>speed: {speed}</Text>
                <Text style={{ fontSize: 20 }}>heading: {heading}</Text>
                <Text style={{ fontSize: 20 }}>elapsed: {formatElapsed(elapsed)}</Text>
                <Text style={{ fontSize: 20 }}>elapsed time: {formatElapsed(elapsedTime)} </Text>
                {
                    this.timerInterval === null ? <Button onPress={this.start}>Start</Button> : <Button onPress={this.stop}>Stop</Button>
                }
                <MapView {...this.state} timerInterval={this.timerInterval} />
            </View>
        )
    }
    componentWillUnmount() {
        if (this.timerInterval !== null) {
            BackgroundTimer.clearInterval(this.timerInterval);
        }
    }
    start = () => {
        permission.checkLocation().then(() => {
            this.setState({ startTime: moment() })
            this.timerInterval = BackgroundTimer.setInterval(() => {
                this.setState({
                    elapsed: this.state.elapsed + 1,
                    elapsedTime: moment().diff(this.state.startTime, 'seconds')
                });
                Geolocation.getCurrentPosition(
                    info => {
                        let now = new Date();
                        this.setState({
                            lat: info.coords.latitude,
                            lng: info.coords.longitude,
                            speed: info.coords.speed,
                            heading: info.coords.heading,
                        })
                    },
                    error => {
                        console.log(error)
                    },
                    { enableHighAccuracy: true }
                );
            }, 1000);
        })
            .catch(() => {
                console.log("NO PERMISSION")
            })
    }

    stop = () => {
        if (this.timerInterval !== null) {
            BackgroundTimer.clearInterval(this.timerInterval);
            this.timerInterval = null
        }
        this.setState({ elapsed: 0 });
    }
}

export default LocationRecordTest