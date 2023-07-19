jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-webview', () => {
    const { View } = require('react-native');
    return {
        WebView: View,
    };
});


const config = {
    transformIgnorePatterns: [
        "node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation/(.*)|react-native-linear-gradient|@react-native-community)"
    ],
};

module.exports = config;