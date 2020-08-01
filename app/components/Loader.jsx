import React from 'react';
import {View, ActivityIndicator, Text} from 'react-native';

export default function Loader({loaderStyle = {}, style = {}}) {
    return (
        <View style={[{fleX: 1}, style]}>
            <ActivityIndicator style={([{flex: 1, justifyContent: 'center', alignItems: 'center'}], loaderStyle)}>
                <Text style={{color: '#fff'}}>Loading</Text>
            </ActivityIndicator>
        </View>
    );
}
