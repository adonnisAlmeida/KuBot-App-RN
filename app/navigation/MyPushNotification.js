import { useEffect, useState } from "react"
import { useLazyQuery, useMutation } from "@apollo/client"
import { useNavigation } from "@react-navigation/native"
import { useDispatch } from "react-redux"
import { PN_CREATE } from "../graphql/pushNotifications"
import { setDeviceToken } from "../redux/userlogin/userLoginSlice"
import { Platform, ToastAndroid } from "react-native"
import pushy from "pushy-react-native"
import PushNotification from "react-native-push-notification"
import { MY_CONVERSATIONS } from "../graphql/messages"
import { setConversations } from "../redux/messages/messagesSlice"


export default function MyPushNotification() {
	const navigation = useNavigation()
	const dispatch = useDispatch()
	const [userConverId, setUserConverId] = useState(null)

	const [pushNotificationCreate, { loadingPNCreate, errorPNCreate, dataPNCreate }] = useMutation(PN_CREATE, {
		onCompleted: (dataPNCreate) => {
			if (Platform.OS === 'android') {
				ToastAndroid.show(`Token de dispositivo actualizado >> ${dataPNCreate.pushNotificationsCreate.device.token}`, ToastAndroid.LONG)
			}
			dispatch(setDeviceToken(dataPNCreate.pushNotificationsCreate.device.token))
		},
		onError: (errorPNCreate) => {
			if (Platform.OS === 'android') {
				ToastAndroid.show(`Error actualizando token del dispositivo`, ToastAndroid.LONG)
			}
			console.log("Error dataPNCreate >> ", errorPNCreate)
		},
		fetchPolicy: "no-cache",
	})

	const [getConversations, { loadingConversations, errorConversations, dataConversations }] = useLazyQuery(MY_CONVERSATIONS, {
		onCompleted: (dataConversations) => {
			dispatch(setConversations(dataConversations.myConversations.edges))
			const conversations = dataConversations.myConversations.edges
			let flag = false
			conversations.forEach(conv => {
				console.log(conv.node.conversationUser.serverId)
				if (userConverId == conv.node.conversationUser.serverId) {
					flag = true
					navigation.navigate('MessagesChatScreen', { message: conv.node })
				}
			});
			if (!flag) navigation.navigate('MessagesScreen')
		},
		onError: (errorConversations) => {
			console.log('error en getConversations', errorConversations)
			navigation.navigate('MessagesScreen')
		},
		fetchPolicy: "no-cache"
	})

	useEffect(() => {

		// Register the user for push notifications
		pushy.register().then(async (deviceToken) => {
			// Display an alert with device token
			//console.log('Pushy device token: ' + deviceToken);

			// Send the token to your backend server via an HTTP GET request
			pushNotificationCreate({
				variables: { deviceToken: deviceToken }
			})
			//await fetch('https://your.api.hostname/register/device?token=' + deviceToken);

			// Succeeded, optionally do something to alert the user
		}).catch((err) => {
			// Handle registration errors
			console.error('Error en tomando pushy.me Token', err);
			if (Platform.OS === 'android') {
				ToastAndroid.show(`Error registrando el dispositivo en pushy.me`, ToastAndroid.LONG)
			}
		});

		PushNotification.configure({
			// (required) Called when a remote is received or opened, or local notification is opened
			onNotification: function (notification) {
				console.log("NOTIFICATION: >>> CLICK", notification.data.category);
				switch (notification.data.category) {
					case 'new_message':
						navigation.navigate('MessagesChatScreen', { conversation_id: notification.data.authorId })
						//setUserConverId(notification.data.authorId)
						//getConversations()
						break;
					case 'order_completed':
						navigation.navigate('AcceptShippingScreen')
						break;
					case 'cambio_estado':
						navigation.navigate('MessengerOrdersDetail', {
							messenger_orders_id: notification.data.order_id,
						})
						break;
					case 'account_active':
						navigation.navigate('Home')
						break;

					default:
						break;
				}
			},
			popInitialNotification: true,

			requestPermissions: Platform.OS === 'ios',
		});
	}, [])

	return (
		<></>
	)
}