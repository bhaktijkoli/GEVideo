import { Platform } from "react-native"
import RNFS from 'react-native-fs'

module.exports.path = (file) => {
    if (Platform.OS === 'android') {
        path = RNFS.ExternalDirectoryPath + "/" + file;

    } else if (Platform.OS === 'ios') {
        path = RNFS.LibraryDirectoryPath + "/" + file
    }
    return path;
}