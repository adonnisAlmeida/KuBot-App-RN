import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { StyleSheet, ScrollView, View, Image } from 'react-native'
import { useTheme } from '@react-navigation/native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useQuery, useMutation } from '@apollo/client'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Typography } from '../../components'
import useAlert from '../../hooks/useAlert'
import { logout } from '../../redux/userlogin/userLoginSlice'
import { user } from '../../redux/userlogin/userLoginSlice'
import { USER_ID } from '../../graphql/user'
import { CUSTOMER_DELETE } from '../../graphql/customers'
import Colors from '../../constants/Colors'
import ContactDetails from './ContactDetails'
import CarrierDetails from './CarrierDetails'

const Tab = createMaterialTopTabNavigator();

export default function ProfileScreen({ navigation }) {
	const { colors } = useTheme()
	const dispatch = useDispatch()
	const user_state = useSelector(user)
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
					color={colors.ON_SURFACE}
					size={22}
					onPress={() => handleCerrarSesion()}
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
		<Tab.Navigator
			screenOptions={{
				tabBarStyle: { backgroundColor: Colors.COLORS.PRIMARY },
				tabBarIndicatorStyle: { backgroundColor: 'rgba(0,0,0,0.7)'},
				tabBarLabelStyle: {fontWeight: "bold", fontSize: 16, textTransform: "none"},
				tabBarActiveTintColor: "rgba(0,0,0,0.7)",
				tabBarInactiveTintColor: "rgba(0,0,0,0.5)",
			}}>
			<Tab.Screen name="ContactDetailsNavView" options={{ tabBarLabel: 'Contacto', title: "PRUEBAA", }} component={ContactDetails} />
			<Tab.Screen name="CarrierDetailsNavView" options={{ tabBarLabel: 'Mensajero' }} component={CarrierDetails} />
		</Tab.Navigator>
	)
}

const styles = StyleSheet.create({
	headerRight: {
		marginRight: 20
	},
})
