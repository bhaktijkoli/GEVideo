import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Grid, Row, Col} from 'react-native-easy-grid';

const styles = StyleSheet.create({
    buttonStyle: {
        width: 40,
        height: 40,
        backgroundColor: '#1f1f1f',
        borderRadius: 40,
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    iconStyle: {
        fontSize: 26,
        color: '#fff',
    },
    gridStyle: {
        paddingVertical: 20,
    },
    leftIcons: {
        paddingLeft: 20,
    },
    rightIcons: {
        paddingLeft: 20,
    },
    speedIndicator: {
        marginLeft: 20,
        backgroundColor: '#1f1f1f',
        height: 40,
        borderTopLeftRadius: 40,
        borderBottomLeftRadius: 40,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    speedIcon: {
        fontSize: 30,
        color: '#fff',
        paddingHorizontal: 8,
    },
    speedText: {
        flexGrow: 1,
        fontSize: 16,
        color: '#fff',
    },
});

const IconButton = ({onPress, iconName = '', buttonStyle = {}, iconStyle = {}}) => {
    return (
        <TouchableOpacity style={[styles.buttonStyle, buttonStyle]} onPress={onPress}>
            <Icon name={iconName} style={[styles.iconStyle, iconStyle]} />
        </TouchableOpacity>
    );
};

const TopControls = ({style, speed = '0 km/h', onExport, onShare, onOpenInfo, onDelete, onToggleDarkMode}) => {
    return (
        <View style={[{flex: 1}, style]}>
            <Grid style={styles.gridStyle}>
                <Row>
                    <Col size={4} style={styles.leftIcons}>
                        <Row>
                            <Col>
                                <IconButton onPress={onExport} iconName="export" iconStyle={{marginLeft: 4}} />
                            </Col>
                            <Col>
                                <IconButton onPress={onShare} iconName="share" iconStyle={{marginBottom: 4}} />
                            </Col>
                            <Col>
                                <IconButton onPress={onOpenInfo} iconName="information-outline" iconStyle={{fontSize: 28}} />
                            </Col>
                            <Col>
                                <IconButton onPress={onDelete} iconName="delete" />
                            </Col>
                            <Col>
                                <IconButton onPress={onToggleDarkMode} iconName="white-balance-sunny" />
                            </Col>
                        </Row>
                    </Col>
                    <Col size={2} style={styles.rightIcons}>
                        <View style={styles.speedIndicator}>
                            <Icon style={[styles.speedIcon, {marginBottom: 2}]} name="speedometer-slow" />
                            <Text style={styles.speedText}>{speed}</Text>
                        </View>
                    </Col>
                </Row>
            </Grid>
        </View>
    );
};

export default TopControls;
