import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Home from './app/screens/Home/Home';
import Record from './app/screens/Record/Record';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator headerMode="none" initialRouteName="Record">
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Record" component={Record} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
