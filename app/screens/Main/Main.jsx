import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'

import Home from './../Home/Home'

const Drawer = createDrawerNavigator();

export default function Main() {
    return (
        <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={Home} />
        </Drawer.Navigator>
    );
}