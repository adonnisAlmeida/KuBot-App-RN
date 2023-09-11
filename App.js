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
import { StyleSheet, View, Text, Platform } from 'react-native';
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
import { user, userToken } from './app/redux/userlogin/userLoginSlice'
import Navigation from './app/navigation/Navigation'
import Pushy from 'pushy-react-native';
import SplashScreen from 'react-native-splash-screen'
import { createUploadLink } from "apollo-upload-client";
//import PushNotificationIOS from "@react-native-community/push-notification-ios";
import Colors from './app/constants/Colors';
import PushNotification, { Importance } from "react-native-push-notification";
import { NavigationContainer, useNavigation } from '@react-navigation/native';





// Must be outside of any component LifeCycle (such as `componentDidMount`).


// Please place this code in App.js,
// After the import statements, and before the Component class

// Enable in-app notification banners (iOS 10+)
//Pushy.toggleInAppBanner(true);

Pushy.setNotificationListener(async (data) => {
    // Print notification payload data
    console.log('Received notification: ' + JSON.stringify(data));

    // Notification title
    let notificationTitle = data.title || 'Notificación de KubotApp';

    // Attempt to extract the "message" property from the payload: {"message":"Hello World!"}
    let notificationText = data.message || 'Test notification';

    // Android: Displays a system notification
    // iOS: Displays an alert dialog
    //Pushy.notify(notificationTitle, notificationText, data);

    PushNotification.localNotification({
        channelId: 'KuBotApp-Channel',
        subText: data.subText? data.subText : "",
        title: data.title,
        message: data.message,
        color: Colors.COLORS.PRIMARY, // (optional) default: system default
        smallIcon: "ic_notification",
        data: data
    });


    /* PushNotification.localNotification({
        channelId: 'KuBotApp-Channel',
        subText: "Nuevo Mensaje",
        title: 'Admin',
        group: "messages",
        message: 'https://media.istockphoto.com/id/1460853312/photo/abstract-connected-dots-and-lines-concept-of-ai-technology-motion-of-digital-data-flow.webp?b=1&s=170667a&w=0&k=20&c=WUSwLiSmeKNLdzCcIQyeCXnOXooAC4cVjwLbKFPPiU0=",',
        color: Colors.COLORS.PRIMARY, // (optional) default: system default
        vibrate: true, // (optional) default: true
        vibration: 300,
        smallIcon: "ic_notification",
        data: data
    }); */

    // Clear iOS badge count
    Pushy.setBadge(0);
});

Pushy.setNotificationClickListener(async (data) => {
    // Display basic alert
    alert('Notification click: ' + data.message);

    // Navigate the user to another page or 
    // execute other logic on notification click
});

//PushNotification.invokeApp(notification)


const App: () => Node = () => {
    useEffect(() => {
        Pushy.listen();
        //Pushy.setNotificationIcon('ic_launcher');
        /* PushNotification.configure({
            // (required) Called when a remote is received or opened, or local notification is opened
            onNotification: function (notification) {
                console.log("NOTIFICATION: >>> CLICK", notification);
                
                if (notification.data.navigate) {
                    console.log('a navegar')
                    navigation.navigate("ProfileScreen")
                }
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            requestPermissions: Platform.OS === 'ios',
        }); */
        PushNotification.createChannel(
            {
                channelId: "KuBotApp-Channel", // (required)
                channelName: "KuBotApp Channel", // (required)
                channelDescription: "KuBotApp notifications channel", // (optional) default: undefined.
                importance: 5,     // <- POPUP NOTIFICATION CHANNEL
                vibrate: true, // (optional) default: true
                vibration: 1000,
            },
            (created) => console.log(`KuBotApp-Channel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
        SplashScreen.hide();
    }, [])

    return (
        <Provider store={store}>
            <Apollo />
        </Provider>
    )
};

function Apollo(props) {
    //const user_state = useSelector(user)
    const user_token = useSelector(userToken)

    const authLink = setContext((_, { headers }) => {
        //const token = user_state.token
        return {
            headers: {
                ...headers,
                authorization: user_token ? `JWT ${user_token}` : '',
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
    //const client = new ApolloClient({
    //    link: createUploadLink({ URL_API }),
    //    cache: new InMemoryCache(),
    //})
    //const client = new ApolloClient({
    //    link: authLink.concat(uploadLink),
    //    cache: new InMemoryCache(),
    //})

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
