import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { StyleSheet, ScrollView, View, Image, Platform, ToastAndroid } from 'react-native'
import { useTheme } from '@react-navigation/native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useQuery, useMutation } from '@apollo/client'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Typography } from '../../components'
import useAlert from '../../hooks/useAlert'
import { deviceToken, logout } from '../../redux/userlogin/userLoginSlice'
import { user, carrierInfo } from '../../redux/userlogin/userLoginSlice'
import { USER_ID } from '../../graphql/user'
import { CUSTOMER_DELETE } from '../../graphql/customers'
import Colors from '../../constants/Colors'
import ContactDetails from './ContactDetails'
import CarrierDetails from './CarrierDetails'
import AwesomeAlert from 'react-native-awesome-alerts'
import { PN_DELETE } from '../../graphql/pushNotifications'

const Tab = createMaterialTopTabNavigator();

export default function ProfileScreen({ navigation }) {
	const dispatch = useDispatch()
	const [showAlertAw, setShowAlert] = useState(false)
	const carrier_state = useSelector(carrierInfo)
	const device_token = useSelector(deviceToken)

	const [pushNotificationDelete, { loadingPNDelete, errorPNDelete, dataPNDelete }] = useMutation(PN_DELETE, {
		onCompleted: (dataPNDelete) => {
			if (Platform.OS === 'android') {
				ToastAndroid.show(`Token de dispositivo eliminado >> ${dataPNDelete.pushNotificationsDelete.device.token}`, ToastAndroid.LONG)
			}
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
		}
	}

	//if (loading || error) return <Loading />

	navigation.setOptions({
		title: 'Perfil',
		headerRight: () => (
			<View style={{ flexDirection: 'row' }}>
				<FontAwesome
					style={styles.headerRight}
					name="sign-out"
					color={'#fff'}
					size={22}
					onPress={() => setShowAlert(true)}
				/>
			</View>
		),
	})

	return (
		<>
			<Tab.Navigator
				screenOptions={{
					tabBarStyle: { backgroundColor: Colors.COLORS.PRIMARY },
					tabBarIndicatorStyle: { backgroundColor: '#fff' },
					tabBarLabelStyle: { fontWeight: "bold", fontSize: 16, textTransform: "none" },
					tabBarActiveTintColor: "#fff",
					tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
				}}>
				<Tab.Screen name="ContactDetailsNavView" options={{ tabBarLabel: 'Contacto', title: "PRUEBAA", }} component={ContactDetails} />
				{
					(carrier_state.kyc == 'PENDING' || carrier_state.kyc == 'APPROVED' || carrier_state.kyc == 'DISAPPROVED') ? (
						<Tab.Screen name="CarrierDetailsNavView" options={{ tabBarLabel: 'Mensajero' }} component={CarrierDetails} />
					): (
						null
					)
				}
			</Tab.Navigator>
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
                onConfirmPressed={() => {
                    handleCerrarSesion()
                }}
            />
		</>
	)
}

const styles = StyleSheet.create({
	headerRight: {
		marginRight: 20
	},
})
