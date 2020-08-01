import React, { Component } from 'react'
import { View, Image } from 'react-native';
import permission from './../../utils/permission';

const logo = require('./../../assets/logo.png');

class Splash extends Component {
    async componentDidMount() {
        try {
            await permission.Location();
            await permission.readStorage();
            await permission.writeStorage();
            await permission.camera();
            await permission.audio();
            this.props.navigation.navigate('Main');
        } catch {
            alert("Permissions not granted");
        }
    }
    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Image source={logo} style={{ height: 128, width: 128 }} />
            </View>
        )
    }
}

export default Splash;