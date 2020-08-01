import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Main from './app/screens/Main/Main';
import Record from './app/screens/Record/Record';
import Play from './app/screens/Play/Play';
import LocationRecordTest from './app/tests/LocationRecordTest/LocationRecordTest';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator headerMode="none" initialRouteName="Play">
                <Stack.Screen name="Main" component={Main} />
                <Stack.Screen name="Record" component={Record} />
                <Stack.Screen name="Play" component={Play} />
                <Stack.Screen name="LocationRecordTest" component={LocationRecordTest} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
