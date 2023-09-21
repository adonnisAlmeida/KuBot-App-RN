import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	ScrollView,
	ActivityIndicator,
	StyleSheet,
	View,
	Dimensions,
	TouchableOpacity,
	//Image,
} from 'react-native'
import { useTheme } from '@react-navigation/native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient';
import { useLazyQuery } from '@apollo/client'

import Theme from '../../constants/Theme'
import { Typography, FloatingActionButton } from '../../components'
import { PRODUCT_TYPES } from '../../graphql/product'
import { setCarrierInfo, user, carrierInfo, setUser } from '../../redux/userlogin/userLoginSlice'
import { CARRIER_INFO, USER_INFO } from '../../graphql/login'
import Colors from '../../constants/Colors'

const { width } = Dimensions.get('window')

export default function HomeScreen({ navigation }) {
	const { colors } = useTheme()
	const [localCarreirInfo, setLocalCarrierInfo] = useState({})
	const dispatch = useDispatch()
	const user_state = useSelector(user)
	const carrier_state = useSelector(carrierInfo)
	const [initUserLoading, setInitUserLoading] = useState(false)
	const [initCarrierLoading, setInitCarrierLoading] = useState(false)
	const [reloadInfo, setReloadInfo] = useState(false)
	const [aborterRefCarrierInfo, setAborterRefCarrierInfo] = useState(new AbortController());
	const [aborterRefUserInfo, setAborterRefUserInfo] = useState(new AbortController());

	/* console.log("countryArea >>>>", user_state.addresses[0].countryArea)
	console.log("cityArea >>>>", user_state.addresses[0].cityArea) */
	//console.log("carrier_state >> ", carrier_state)
	//console.log("localCarreirInfo >> ", localCarreirInfo)
	//console.log("user_state >> ", user_state)

	const [getCarrierInfo, { loading, error, data }] = useLazyQuery(CARRIER_INFO, {
		onCompleted: (data) => {
			dispatch(setCarrierInfo(data.myCarrierInfo))
			setInitCarrierLoading(false)
			setReloadInfo(false)
		},
		onError: (error) => {
			setInitCarrierLoading(false)
			setReloadInfo(false)
			dispatch(setCarrierInfo({}))
			console.log('ERROR GET_CARRIER_BY_USER_EMAIL >> ', JSON.stringify(error, null, 2))
		},
		fetchPolicy: "no-cache",
		context: {
			fetchOptions: {
				signal: aborterRefCarrierInfo.signal
			}
		},
	})

	const [getLogedUserInfo, { loadingUserInfo, errorUserInfo, dataUserInfo }] = useLazyQuery(USER_INFO, {
		onCompleted: (dataUserInfo) => {
			if (dataUserInfo.me) {
				dispatch(setUser(dataUserInfo.me))
			}
			getCarrierInfo()
			setInitUserLoading(false)
		},
		onError: (errorUserInfo) => {
			console.log("Error Info User >> ", errorUserInfo)
			setInitUserLoading(false)
			setReloadInfo(false)
		},
		fetchPolicy: "no-cache",
		context: {
			fetchOptions: {
				signal: aborterRefUserInfo.signal
			}
		},
	})

	useEffect(() => {
		setInitUserLoading(true)
		setInitCarrierLoading(true)
		getLogedUserInfo()		
	}, [])

	useEffect(() => {
		setLocalCarrierInfo(carrier_state)
	}, [carrier_state])

	navigation.setOptions({
		headerRight: () => (
			<View style={{ flexDirection: 'row' }}>
				<FontAwesome
					style={styles.headerRight}
					name="user-circle-o"
					color={'#fff'}
					size={23}
					onPress={() => navigation.navigate('Profile')}
				/>
				{/* <FontAwesome
					style={styles.headerRight}
					name="external-link"
					color={colors.ON_SURFACE}
					size={20}
					onPress={() =>
						Linking.openURL(URL).catch((err) =>
							console.error("Couldn't load page", err)
						)
					}
				/> */}
			</View>
		),
	})

	const buttons = () => {
		return (
			<FloatingActionButton
				icon="shopping-bag"
				onPress={() => navigation.navigate('Products')}
			/>
		)
	}

	const hello = () => {
		const name = user_state.firstName
			? user_state.firstName + ' ' + user_state.lastName
			: user_state.email

		const crearNotificacion = () => {
			navigation.navigate("PruebasScreen")
			/* console.log("A CREAR")
			

			PushNotification.getChannels(function (channel_ids) {
				console.log(channel_ids); // ['channel_id_1']
				channel_ids.forEach(chan => {
					if (chan == "channel-id-1" || chan == "channel-id-2")
						PushNotification.deleteChannel(chan);
				})
			});

			PushNotification.localNotification({
				channelId: "KuBotApp-Channel",
				title: "Titulo",
				ticker: "My Notification Ticker", // (optional)
				showWhen: false, // (optional) default: true
				//largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
				//largeIconUrl: "https://www.blogdelfotografo.com/wp-content/uploads/2022/01/girasol-foto-perfil.webp", // (optional) default: "ic_launcher". Use "" for no large icon.
				autoCancel: true, // (optional) default: true
				smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.

				bigText: "My big text that will be shown when notification is expanded. Styling can be done using HTML tags(see android docs for details)", // (optional) default: "message" prop
				subText: "This is a subText", // (optional) default: none
				//bigPictureUrl: "https://d500.epimg.net/cincodias/imagenes/2019/06/04/lifestyle/1559679036_977776_1559679371_noticia_normal.jpg", // (optional) default: undefined
				//bigLargeIcon: "ic_launcher", // (optional) default: undefined
				//bigLargeIconUrl: "https://i.blogs.es/09b647/googlefotos/1366_2000.jpg", // (optional) default: undefined
				//color: Colors.COLORS.PRIMARY,
				message: "Mensaje",
				bigText: "El mensaje largo va aqui",

				visibility: "public",
				onlyAlertOnce: true,

				actions: ["ReplyInput"],
				reply_placeholder_text: "Write your response...", // (required)
				reply_button_text: "Reply" // (required)
			}); */

			/* PushNotification.localNotification({
				//Android Only Properties 
				channelId: "KuBotApp-Channel", // (required) channelId, if the channel doesn't exist, notification will not trigger.
				ticker: "My Notification Ticker", // (optional)
				showWhen: true, // (optional) default: true
				autoCancel: true, // (optional) default: true
				//largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
				//largeIconUrl: "https://media.istockphoto.com/id/1408387701/photo/social-media-marketing-digitally-generated-image-engagement.webp?s=1024x1024&w=is&k=20&c=Bck-z2Z287uKcEDpoLS7F1VA9NzdBbF7gY0ZTyYPoTs=", // (optional) default: undefined
				smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
				bigText: "My big text that will be shown when notification is expanded. Styling can be done using HTML tags(see android docs for details)", // (optional) default: "message" prop
				subText: "This is a subText", // (optional) default: none
				//bigPictureUrl: "https://plus.unsplash.com/premium_photo-1682124850312-7a1955d99732?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXJsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60", // (optional) default: undefined
				//bigLargeIcon: "ic_launcher", // (optional) default: undefined
				//bigLargeIconUrl: "https://media.istockphoto.com/id/1434947710/photo/businessman-headphones-and-laptop-webinar-in-office-with-coffee-on-table-video-call-or.webp?s=1024x1024&w=is&k=20&c=NvC5p29pg1jBXw-IEzCTYg3Mv1A11k8BGVFqRw-DCDk=", // (optional) default: undefined
				color: "green", // (optional) default: system default
				vibrate: true, // (optional) default: true
				vibration: 1100, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
		
			}); */
		}

		return (
			<View style={{ marginBottom: 16 }}>
				<Typography h1 color={colors.ON_BACKGROUND}>
					Hola,
				</Typography>
				<Typography h1 bold color={colors.ON_BACKGROUND}>
					{name}
				</Typography>
				{/* <TouchableOpacity
					onPress={() => crearNotificacion()}
				>
					<Typography>
						Crear notificacion
					</Typography>
				</TouchableOpacity> */}
			</View>
		)
	}

	const reloadCarrier = () => {
		setReloadInfo(true)
		aborterRefUserInfo.abort();
		setAborterRefUserInfo(new AbortController());
		aborterRefCarrierInfo.abort();
		setAborterRefCarrierInfo(new AbortController());
		getLogedUserInfo()
	}

	const carrierApplication = () => {
		//console.log("carrierApplication >>", localCarreirInfo.kyc)
		if (initCarrierLoading || initUserLoading) {
			return (null)
		} else {
			if (Object.keys(localCarreirInfo).length == 0) {// elcarrier no ha terminado el registro
				return (
					<LinearGradient
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						colors={[Colors.COLORS.WARNING, '#FB6360']}
						style={[
							styles.recent,
							{ backgroundColor: '#fff', marginBottom: 20 },
						]}
					>
						<TouchableOpacity
							onPress={() => navigation.navigate("CarrierApplicationScreen")}
						>
							<View>
								<Typography h3 bold color="#ffffff">
									Su registro de cuenta de mensajero no está completo, presione aquí para completarlo.
								</Typography>
							</View>
						</TouchableOpacity>
					</LinearGradient>

				)
			} else if (localCarreirInfo.kyc == "PENDING") {
				return (
					<LinearGradient
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						colors={[Colors.COLORS.INFO, '#11CDff']}
						style={[
							styles.recent,
							{ backgroundColor: '#fff', marginBottom: 20 },
						]}
					>
						{reloadInfo ? (
							<ActivityIndicator
								size={15}
								color='#fff'
								style={{
									position: 'absolute',
									right: 5,
									top: 3,
								}}
							/>
						) : (null)}
						<TouchableOpacity
							onPress={() => reloadCarrier()}
							disabled={reloadInfo}
						>
							<View>
								<Typography h3 bold color="#ffffff">
									Su cuenta de mensajero está siendo procesada.
								</Typography>
							</View>
						</TouchableOpacity>
					</LinearGradient>
				)
			} else if (localCarreirInfo.kyc == "DISAPPROVED") {
				return (
					<LinearGradient
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						colors={[Colors.COLORS.LABEL, '#FE2472']}
						style={[
							styles.recent,
							{ backgroundColor: '#fff', marginBottom: 20 },
						]}
					>
						{reloadInfo ? (
							<ActivityIndicator
								size={15}
								color='#fff'
								style={{
									position: 'absolute',
									right: 5,
									top: 3,
								}}
							/>
						) : (null)}

						<TouchableOpacity
							onPress={() => reloadCarrier()}
							disabled={reloadInfo}
						>
							<View>
								<Typography h3 bold color="#ffffff">
									Lo sentimos su cuenta de mensajero no ha sido aprobada.
								</Typography>
							</View>
						</TouchableOpacity>
					</LinearGradient>
				)
			} else if (localCarreirInfo.kyc == "APPROVED") {
				return null
			}
		}

	}
	const product = () => {
		return (
			<LinearGradient
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				colors={[colors.PRIMARY, colors.SECUNDARY]}
				style={[
					styles.recent,
					{ backgroundColor: colors.SURFACE, marginBottom: 20 },
				]}
			>
				<View style={[styles.cicle, { height: 70, width: 70, margin: 0 }]}>
					<View style={styles.cicle}>
						<FontAwesome
							style={{ padding: 10 }}
							name="info"
							size={32}
							color="#FFF"
						/>
					</View>
				</View>
				<View style={styles.hola_text}>
					<Typography
						h2
						bold
						color="#ffffff"
						style={{
							marginBottom: 2,
						}}
					>
						Información
					</Typography>
					<Typography h3 color="#ffffff">
						24 nuevos productos
					</Typography>
				</View>
			</LinearGradient>
		)
	}

	const recent = () => {
		const [products, setProducts] = useState([])
		const [loading, setLoading] = useState([])

		const [recentsProducts, { loadingProducts, errorProducts, dataProducts }] = useLazyQuery(PRODUCT_TYPES, {
			onCompleted: (dataProducts) => {
				setProducts(dataProducts)
				setLoading(false)
			},
			onError: (errorProducts) => {
				setLoading(false)
				console.log('ERROR recentsProducts >> ', JSON.stringify(errorProducts, null, 2))
			},
			fetchPolicy: "no-cache"
		})

		useEffect(() => {
			setLoading(true)
			recentsProducts()
		}, [])

		return (
			<View>
				<Typography color={colors.ON_BACKGROUND} style={{ marginBottom: 10 }}>
					TIPOS DE PRODUCTOS
				</Typography>
				{loading ? (
					<ActivityIndicator size="small" color={colors.primary} />
				) : (
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							flexWrap: 'wrap',
						}}
					>
						{products?.productTypes?.edges.map((edges, index) => {
							return (
								<View
									key={index}
									style={[
										styles.product_type,
										{ backgroundColor: colors.SURFACE },
									]}
								>
									<Typography bold regular color={colors.ON_SURFACE}>
										{edges.node.name}
									</Typography>
									<Typography regular color={colors.ON_SURFACE}>
										{edges.node.products.totalCount} unidades
									</Typography>
								</View>
							)
						})}
					</View>
				)}
				{/* {(loading || error || initUserLoading || initCarrierLoading) && (
					<ActivityIndicator size="small" color={colors.primary} />
				)}

				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						flexWrap: 'wrap',
					}}
				>
					{!(loading || error || initUserLoading || initCarrierLoading) &&
						products.productTypes.edges.map((edges, index) => {
							return (
								<View
									key={index}
									style={[
										styles.product_type,
										{ backgroundColor: colors.SURFACE },
									]}
								>
									<Typography bold regular color={colors.ON_SURFACE}>
										{edges.node.name}
									</Typography>
									<Typography regular color={colors.ON_SURFACE}>
										{edges.node.products.totalCount} unidades
									</Typography>
								</View>
							)
						})}
				</View> */}
			</View>
		)
	}

	return (
		<View style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				{hello()}
				{/* <TouchableOpacity onPress={() => navigation.navigate("PruebasScreen")}>
					<Typography>
						Pruebas View
					</Typography>
				</TouchableOpacity> */}
				{carrierApplication()}
				{product()}
				{recent()}
			</ScrollView>
			{buttons()}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
	},
	recent: {
		flexDirection: 'row',
		borderColor: 'transparent',
		borderRadius: Theme.SIZES.RADIUS,
		marginVertical: 5,
		padding: Theme.SIZES.BASE,
		elevation: 5,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 1.5 },
		shadowRadius: Theme.SIZES.RADIUS,
	},
	product_type: {
		width: (width - 48) / 2,
		borderColor: 'transparent',
		borderRadius: Theme.SIZES.RADIUS,
		marginVertical: 5,
		padding: Theme.SIZES.BASE,
		elevation: 1,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 1.5 },
		shadowRadius: Theme.SIZES.RADIUS,
	},
	cicle: {
		position: 'relative',
		height: 50,
		width: 50,
		borderRadius: 50,
		backgroundColor: '#FFFFFF25',
		alignItems: 'center',
		alignContent: 'center',
		margin: 10,
	},
	hola_text: {
		marginHorizontal: 16,
		marginVertical: 8,
	},
	headerRight: {
		marginRight: 20,
	},
})
