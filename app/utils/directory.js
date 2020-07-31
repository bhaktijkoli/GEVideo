import { Platform } from "react-native"
import RNFS from 'react-native-fs'

module.exports.path = (file) => {
    if (Platform.OS === 'android') {
        path = RNFS.ExternalStorageDirectoryPath + '/GEVidoes/' + file;

    } else if (Platform.OS === 'ios') {
        path = RNFS.LibraryDirectoryPath + '/GEVidoes/' + file
    }
    return path;
}