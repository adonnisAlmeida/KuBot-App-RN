import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StyleSheet, TouchableOpacity, View, Text, Platform, ToastAndroid } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useTheme } from '@react-navigation/native'

import { deviceToken, logout } from '../redux/userlogin/userLoginSlice'
import Theme from '../constants/Theme'
import Colors from '../constants/Colors'
import AwesomeAlert from 'react-native-awesome-alerts'
import { useMutation } from '@apollo/client'
import { PN_DELETE } from '../graphql/pushNotifications'

export function DrawerItem(props) {
	const { title, icon, navigate, focused, navigation } = props
	const { dark } = useTheme()

	const containerStyles = [
		styles.defaultStyle,
		focused
			? !dark
				? [styles.activeStyle, styles.shadow]
				: [styles.activeStyle, styles.shadow]
			: null,
	]

	return (
		<TouchableOpacity
			style={styles.constains}
			onPress={() => {
				navigation.closeDrawer()
				navigation.navigate(navigate)
			}}
		>
			<View style={containerStyles}>
				<View style={{ left: 0 }}>
					<FontAwesome
						name={icon}
						size={20}
						color={
							focused
								? Colors.COLORS.WHITE
								: dark
									? Colors.COLORS.WHITE
									: Colors.COLORS.BLACK
						}
					/>
				</View>
				<View style={{ left: 20 }}>
					<Text
						size={16}
						style={{
							color: focused
								? Colors.COLORS.WHITE
								: dark
									? Colors.COLORS.WHITE
									: Colors.COLORS.BLACK,
							fontWeight: focused ? 'bold' : 'normal',
						}}
					>
						{title}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

export function DrawerItemLogout(props) {
	const { title, icon } = props
	const { dark } = useTheme()
	const dispatch = useDispatch()
	const [showAlertAw, setShowAlert] = useState(false)
	const device_token = useSelector(deviceToken)

	const containerStyles = [styles.defaultStyle]

	const [pushNotificationDelete, { loadingPNDelete, errorPNDelete, dataPNDelete }] = useMutation(PN_DELETE, {
		onCompleted: (dataPNDelete) => {
			/* if (Platform.OS === 'android') {
				ToastAndroid.show(`Token de dispositivo eliminado >> ${dataPNDelete.pushNotificationsDelete.device.token}`, ToastAndroid.LONG)
			} */
			dispatch(logout())
		},
		onError: (errorPNDelete) => {
			/* if (Platform.OS === 'android') {
				ToastAndroid.show(`Error eliminando token del dispositivo`, ToastAndroid.LONG)
			} */
			dispatch(logout())
			console.log("Error dataPNDelete >> ", errorPNDelete)
		},
		fetchPolicy: "no-cache",
	})

	const handleCerrarSesion = () => {
		if (device_token != "") {
			pushNotificationDelete({
				variables: { deviceToken: device_token }
			})
		}else{
			dispatch(logout())
		}
	}

	return (
		<>
			<TouchableOpacity
				style={styles.constains}
				onPress={() => setShowAlert(true)}
			>
				<View style={containerStyles}>
					<View style={{ left: 0 }}>
						<FontAwesome
							name={icon}
							size={20}
							color={dark ? Colors.COLORS.WHITE : Colors.COLORS.BLACK}
						/>
					</View>
					<View style={{ left: 20 }}>
						<Text
							size={16}
							style={{
								color: dark ? Colors.COLORS.WHITE : Colors.COLORS.BLACK,
								fontWeight: 'normal',
							}}
						>
							{title}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
			<AwesomeAlert
				show={showAlertAw}
				title="Cerrar sesión"
				message="¿Está seguro de cerrar sesión?"
				closeOnTouchOutside={true}
				closeOnHardwareBackPress={true}
				showCancelButton={true}
				showConfirmButton={true}
				cancelText="Cancelar"
				confirmText="Aceptar"
				confirmButtonColor={Colors.COLORS.WARNING}
				onCancelPressed={() => {
					setShowAlert(false)
				}}
				onDismiss={() => {
					setShowAlert(false)
				}}
				onConfirmPressed={() => handleCerrarSesion()}
			/>
		</>

	)
}

export function DrawerItemPerfil(props) {
	const { title, icon, navigation, focused } = props
	const { dark } = useTheme()

	const containerStyles = [
		styles.defaultStyle,
		focused
			? !dark
				? [styles.activeStyle, styles.shadow]
				: [styles.activeStyle, styles.shadow]
			: null,
	]

	return (
		<TouchableOpacity
			style={styles.constains}
			onPress={() => {
				navigation.closeDrawer()
				navigation.navigate('Profile')
			}}
		>
			<View style={containerStyles}>
				<View style={{ left: 0 }}>
					<FontAwesome
						name={icon}
						size={20}
						color={
							focused
								? Colors.COLORS.WHITE
								: dark
									? Colors.COLORS.WHITE
									: Colors.COLORS.BLACK
						}
					/>
				</View>
				<View style={{ left: 20 }}>
					<Text
						size={16}
						style={{
							color: focused
								? Colors.COLORS.WHITE
								: dark
									? Colors.COLORS.WHITE
									: Colors.COLORS.BLACK,
							fontWeight: focused ? 'bold' : 'normal',
						}}
					>
						{title}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	constains: {
		//backgroundColor: 'red',
		height: 55,
	},
	defaultStyle: {
		flex: 1,
		flexDirection: 'row',
		paddingVertical: 17,
		paddingHorizontal: 16,
	},
	activeStyle: {
		backgroundColor: Theme.LIGHT.PRIMARY,
		borderTopRightRadius: 100,
		borderBottomRightRadius: 100,
		//borderRadius: 10,
	},
	activeStyleDark: {
		backgroundColor: Colors.COLORS.ACTIVE_DARKMODE,
		borderRadius: 10,
	},
	shadow: {
		elevation: 8,
		shadowColor: Colors.COLORS.BLACK,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowRadius: 8,
		shadowOpacity: 0.1,
	},
	label: {
		backgroundColor: Colors.COLORS.LABEL,
		paddingHorizontal: 6,
		marginLeft: 10,
		borderRadius: 6,
		height: 16,
		width: 36,
	},
})

/*
<View middle style={styles.label}>
  <Text size={12} color={Colors.COLORS.WHITE}>
	PRO
  </Text>
</View>
*/
