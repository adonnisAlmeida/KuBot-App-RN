import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { StyleSheet, ScrollView, View, Image } from 'react-native'
import { useTheme } from '@react-navigation/native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useQuery, useMutation } from '@apollo/client'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Typography } from '../../components'
import useAlert from '../../hooks/useAlert'
import { logout } from '../../redux/userlogin/userLoginSlice'
import { user, carrierInfo } from '../../redux/userlogin/userLoginSlice'
import { USER_ID } from '../../graphql/user'
import { CUSTOMER_DELETE } from '../../graphql/customers'
import Colors from '../../constants/Colors'
import ContactDetails from './ContactDetails'
import CarrierDetails from './CarrierDetails'
import AwesomeAlert from 'react-native-awesome-alerts'

const Tab = createMaterialTopTabNavigator();

export default function ProfileScreen({ navigation }) {
	const { colors } = useTheme()
	const dispatch = useDispatch()
	const [showAlertAw, setShowAlert] = useState(false)
	const user_state = useSelector(user)
	const carrier_state = useSelector(carrierInfo)
	const [customerDelete, result] = useMutation(CUSTOMER_DELETE)

	const { alert, showAlert } = useAlert({
		title: '¿Estas Seguro?',
		subtitle: `Se eliminará el usuario ${user_state.firstName} ${user_state.lastName}.`,
		buttons: [
			{
				title: 'Eliminar',
				style: 'delete',
				onPress: () => {
					//customerDelete({ variables: { id: user_state.id } });
					handleCerrarSesion()
				},
			},
			{
				title: 'Cancelar',
				style: 'cancel',
			},
		],
	})

	const handleEliminar = () => {
		showAlert()
	}

	const handleCerrarSesion = () => {
		dispatch(logout())
	}

	const handleEditarProfile = () => {
		navigation.navigate('EditarProfile', {
			user_id: user_state.id,
			user_firstName: `${user_state.firstName}`,
			user_lastName: `${user_state.lastName}`,
		})
	}

	//if (loading || error) return <Loading />

	navigation.setOptions({
		title: 'Perfil',
		headerRight: () => (
			<View style={{ flexDirection: 'row' }}>
				{/* <FontAwesome
					style={styles.headerRight}
					name="edit"
					color={colors.ON_SURFACE}
					size={20}
					onPress={() => handleEditarProfile()}
				/> */}
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

	const avatar = user_state.avatar
		? {
			uri: user_state.avatar.url,
		}
		: require('../../../assets/user_avatar.png')

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
                confirmButtonColor="#F5365C"
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
