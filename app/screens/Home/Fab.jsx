import React from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});

export default Fab = (props) => {
    const navigation = useNavigation();
    return (
        <ActionButton buttonColor={colors.primary}>
            <ActionButton.Item buttonColor={colors.success} title="Record Video" onPress={() => navigation.navigate('Record')}>
                <Icon name="video" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor={colors.warning} title="Import Video" onPress={() => { }}>
                <Icon name="file-video" style={styles.actionButtonIcon} />
            </ActionButton.Item>
        </ActionButton>
    );
}