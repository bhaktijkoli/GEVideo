import { Platform } from "react-native"
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

module.exports.Location = () => {
    if (Platform.OS === 'android') {
        return checkPermission(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);

    } else if (Platform.OS === 'ios') {
        return checkPermission(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    }
}

module.exports.writeStorage = () => {
    if (Platform.OS === 'android') {
        return checkPermission(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)

    } else if (Platform.OS === 'ios') {
    }
}

const checkPermission = (permissionId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let permission = await check(permissionId);
            if (permission !== RESULTS.GRANTED) {
                permission = await request(permissionId);
                if (permission !== RESULTS.GRANTED) {
                    print("REJECT");
                    return reject();
                }
            }
            return resolve();
        } catch (error) {
            console.error(error)
        }
    })
}