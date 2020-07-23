import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {Button} from '../../components';

class Home extends Component {
    render() {
        return (
            <View>
                <Text>Home Screen</Text>
                <Button
                    onPress={(e) => this.props.navigation.navigate('Record')}>
                    Record
                </Button>
            </View>
        );
    }
}

export default Home;
