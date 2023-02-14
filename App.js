/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import type { Node } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    createHttpLink,
    ApolloLink,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { getDarkMode, loading } from './app/redux/darkmode/darkModeSlice'
import store from './app/redux/store'
import { URL_API } from './app/constants/Other'
import { Loading } from './app/components'
import { user } from './app/redux/userlogin/userLoginSlice'
import Navigation from './app/navigation/Navigation'
import Pushy from 'pushy-react-native';
import SplashScreen from 'react-native-splash-screen'
import { createUploadLink } from "apollo-upload-client";

// Please place this code in App.js,
// After the import statements, and before the Component class

// Enable in-app notification banners (iOS 10+)
Pushy.toggleInAppBanner(true);

Pushy.setNotificationListener(async (data) => {
    // Print notification payload data
    console.log('Received notification: ' + JSON.stringify(data));

    // Notification title
    let notificationTitle = 'KubotApp Titulo';

    // Attempt to extract the "message" property from the payload: {"message":"Hello World!"}
    let notificationText = data.message || 'Test notification';

    // Android: Displays a system notification
    // iOS: Displays an alert dialog
    Pushy.notify(notificationTitle, notificationText, data);

    // Clear iOS badge count
    Pushy.setBadge(0);
});


const App: () => Node = () => {
    useEffect(() => {
        Pushy.listen();
        Pushy.setNotificationIcon('ic_launcher');
        SplashScreen.hide();
    }, [])

    return (
        <Provider store={store}>
            <Apollo />
        </Provider>
    )
};
function Apollo(props) {
    const user_state = useSelector(user)

    const authLink = setContext((_, { headers }) => {
        const token = user_state.token
        return {
            headers: {
                ...headers,
                authorization: token ? `JWT ${token}` : '',
            },
        }
    })

    const httpLink = createHttpLink({
        uri: URL_API,
    })

    const uploadLink = createUploadLink({
        uri: URL_API,
    })


    const client = new ApolloClient({
        link: ApolloLink.from([
            authLink,
            //httpLink,
            uploadLink,
        ]),
        cache: new InMemoryCache(),
    })
    /* const client = new ApolloClient({
        link: createUploadLink({ URL_API }),
        cache: new InMemoryCache(),
    }) */
    /* const client = new ApolloClient({
        link: authLink.concat(uploadLink),
        cache: new InMemoryCache(),
    }) */

    return (
        <ApolloProvider client={client}>
            <LightDarkMode />
        </ApolloProvider>
    )
}

function LightDarkMode(props) {
    const dispatch = useDispatch()
    const isLoading = useSelector(loading)

    React.useEffect(() => {
        dispatch(getDarkMode())
    }, [])

    if (isLoading) return <Loading />
    return <Navigation />
}

export default App;
