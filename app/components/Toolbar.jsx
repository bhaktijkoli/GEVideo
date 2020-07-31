import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import style from './../styles/style';
import colors from '../styles/colors';


export default (props) => {
    const navigation = useNavigation();
    return (
        <View style={[style.shadow, { width: '100%', backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }]}>
            <TouchableOpacity activeOpacity={0.8} onPress={e => navigation.openDrawer()}>
                <Icon name="menu" size={36} color="#FFF" />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, color: '#FFF', marginLeft: 10 }}>GE Videos</Text>
            {
                props.children
            }
        </View>
    )
}