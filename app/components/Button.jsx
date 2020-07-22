import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import colors from '../styles/colors';

export default Button = (props) => {
    let buttonStyle = {
        backgroundColor: colors.primary,
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        border: 8,
    }

    let textStyle = {
        color: '#FFF',
        fontSize: 16,
    }

    return (
        <TouchableOpacity activeOpacity={0.8} {...props} style={[buttonStyle, props.style]}>
            <Text style={[textStyle, props.textStyle]}>
                {props.children}
            </Text>
        </TouchableOpacity>
    )
}