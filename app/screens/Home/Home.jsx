import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Toolbar } from '../../components';
import Fab from './Fab';

class Home extends Component {
    render() {
        return (
            <React.Fragment>
                <Toolbar />
                <View>
                    <Text>Home Screen</Text>
                </View>
                <Fab />
            </React.Fragment>
        );
    }
}

export default Home;
