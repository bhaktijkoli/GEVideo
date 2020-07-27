import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from '../../components';
import Geolocation from 'react-native-geolocation-service';
import permission from '../../utils/permission';

class LocationRecordTest extends Component {

    state = {
        lat: 0,
        lng: 0,
        speed: 0,
        heading: 0,
        elapsed: 0,
        timerInterval: null,
    }

    render() {
        let { lat, lng, speed, heading, timerInterval } = this.state;
        return (
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20 }}>Lat: {lat}</Text>
                <Text style={{ fontSize: 20 }}>Lng: {lng}</Text>
                <Text style={{ fontSize: 20 }}>speed: {speed}</Text>
                <Text style={{ fontSize: 20 }}>heading: {heading}</Text>
                <Text style={{ fontSize: 20 }}>elapsed: {this.formatElapsed()}</Text>
                {
                    timerInterval === null ?
                        <Button onPress={this.start}>Start</Button> :
                        <Button onPress={this.stop}>Stop</Button>
                }

            </View>
        )
    }

    start = () => {
        permission.checkLocation().then(() => {

            let timerInterval = setInterval(() => {
                this.setState({ elapsed: this.state.elapsed + 1 })
                Geolocation.getCurrentPosition(info => {
                    this.setState({
                        lat: info.coords.latitude,
                        lng: info.coords.longitude,
                        speed: info.coords.speed,
                        heading: info.coords.heading,
                    })
                });
            }, 1000)

            this.setState({ timerInterval })

        })
            .catch(() => {
                console.log("NO PERMISSION")
            })
    }

    stop = () => {
        clearInterval(this.state.timerInterval);
        this.setState({ timerInterval: null, elapsed: 0 });
    }

    formatElapsed = () => {
        let { elapsed } = this.state;
        let minutes = 0
        while (elapsed > 60) {
            minutes++;
            elapsed -= 60;
        }

        if (minutes < 9) minutes = `0${minutes}`;
        if (elapsed < 9) elapsed = `0${elapsed}`;

        return `${minutes}:${elapsed}`
    }
}

export default LocationRecordTest