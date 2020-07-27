import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

module.exports.checkLocation = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let permission = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            if (permission !== RESULTS.GRANTED) {
                permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
                if (permission !== RESULTS.GRANTED) {
                    console.log("REJECTED");
                    return reject();
                }
            }
            console.log("GRANTED");
            return resolve();
        } catch (error) {
            console.error(error)
        }
    })
}