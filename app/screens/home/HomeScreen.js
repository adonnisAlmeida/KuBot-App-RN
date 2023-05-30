import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	ScrollView,
	ActivityIndicator,
	StyleSheet,
	View,
	Dimensions,
	Linking,
	Text,
	TouchableOpacity,
	Modal,
	TouchableWithoutFeedback,
	Platform,
	ToastAndroid,
	//Image,
} from 'react-native'
import { useTheme } from '@react-navigation/native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
//import { LinearGradient } from 'expo-linear-gradient'
import LinearGradient from 'react-native-linear-gradient';
import { useLazyQuery, useQuery } from '@apollo/client'

import Theme from '../../constants/Theme'
import { Typography, FloatingActionButton } from '../../components'
import { PRODUCT_TYPES } from '../../graphql/product'
import { setCarrierInfo, user, carrierInfo } from '../../redux/userlogin/userLoginSlice'
import { URL } from '../../constants/Other'
import Pushy from 'pushy-react-native';
import { GET_CARRIER_BY_USER_EMAIL } from '../../graphql/login'
import Colors from '../../constants/Colors'

const { width } = Dimensions.get('window')

export default function HomeScreen({ navigation }) {
	const { colors } = useTheme()
	const [localCarreirInfo, setLocalCarrierInfo] = useState({})
	const dispatch = useDispatch()
	const user_state = useSelector(user)
	const carrier_state = useSelector(carrierInfo)
	const [pushyToken, setPushyToken] = useState(null)

	/* console.log("countryArea >>>>", user_state.addresses[0].countryArea)
	console.log("cityArea >>>>", user_state.addresses[0].cityArea) */
	//console.log("carrier_state >> ", carrier_state)
	//console.log("localCarreirInfo >> ", localCarreirInfo)
	//console.log("user_state.isCarrier >> ", user_state.isCarrier)

	const [getCarrierByUserEmail, { loading, error, data }] = useLazyQuery(GET_CARRIER_BY_USER_EMAIL, {
		onCompleted: (data) => {
			if (data.carriers.edges.length >= 1) {
				dispatch(setCarrierInfo(data.carriers.edges[0].node))
			} else {
				dispatch(setCarrierInfo({}))
			}

		},
		onError: (error) => {
			console.log('ERROR GET_CARRIER_BY_USER_EMAIL >> ', error)
		},
		fetchPolicy: "no-cache"
	})

	useEffect(() => {
		getCarrierByUserEmail({ variables: { userEmail: user_state.email } })
		// Register the user for push notifications
		Pushy.register().then(async (deviceToken) => {
			// Display an alert with device token
			setPushyToken(deviceToken)
			//console.log('Pushy device token: ' + deviceToken);

			// Send the token to your backend server via an HTTP GET request
			//await fetch('https://your.api.hostname/register/device?token=' + deviceToken);

			// Succeeded, optionally do something to alert the user
		}).catch((err) => {
			// Handle registration errors
			console.error('Error en tomando pushy.me Token', err);
		});
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
					size={20}
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

		return (
			<View style={{ marginBottom: 16 }}>
				<Typography h1 color={colors.ON_BACKGROUND}>
					Hola,
				</Typography>
				<Typography h1 bold color={colors.ON_BACKGROUND}>
					{name}
				</Typography>
			</View>
		)
	}

	const carrierApplication = () => {
		//console.log("carrierApplication >>", localCarreirInfo.kyc)
		if (loading) {
			console.log("Loading")
			return null
		} else {
			if (Object.keys(localCarreirInfo).length == 0) {// elcarrier no ha terminado el registro
				return (
					<TouchableOpacity
						onPress={() => navigation.navigate("CarrierApplicationScreen")}
					>
						<LinearGradient
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							colors={[Colors.COLORS.WARNING, '#FB6360']}
							style={[
								styles.recent,
								{ backgroundColor: '#fff', marginBottom: 20 },
							]}
						>
							<View>
								<Typography h3 bold color="#ffffff">
									Su registro de cuenta de mensajero no está completo, presione aquí para completarlo.
								</Typography>
							</View>
						</LinearGradient>
					</TouchableOpacity>
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
						<View>
							<Typography h3 bold color="#ffffff">
								Su solicitud de cuenta de mensajero está siendo procesada.
							</Typography>
						</View>
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
						<View>
							<Typography h3 bold color="#ffffff">
								Lo sentimos su cuenta de mensajero no ha sido aprobada.
							</Typography>
						</View>
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
		const { loading, error, data } = useQuery(PRODUCT_TYPES)

		return (
			<View>
				<Typography color={colors.ON_BACKGROUND} style={{ marginBottom: 10 }}>
					TIPOS DE PRODUCTOS
				</Typography>
				{(loading || error) && (
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
					{!(loading || error) &&
						data.productTypes.edges.map((edges, index) => {
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
