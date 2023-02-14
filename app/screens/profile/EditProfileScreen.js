import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
	Platform,
	StyleSheet,
	View,
	ToastAndroid,
	TextInput,
} from 'react-native'
import { useTheme } from '@react-navigation/native'
import { useMutation } from '@apollo/client'

import Typography from '../../components/Typography'
import Button from '../../components/Button'
import { CUSTOMER_UPDATE } from '../../graphql/customers'
import { setUser, user } from '../../redux/userlogin/userLoginSlice'

export default function EditProfileScreen({ navigation, route }) {
	const { colors } = useTheme()
	const dispatch = useDispatch()
	const user_state = useSelector(user)

	const user_id = route.params?.user_id,
		user_firstName = route.params?.user_firstName,
		user_lastName = route.params?.user_lastName

	const [firstName, setFirstName] = React.useState()
	const [lastName, setLastName] = React.useState()
	const [errors, setErrors] = React.useState([])

	console.log("USER ID >> ",user_id)

	React.useEffect(() => {
		setFirstName(user_firstName)
		setLastName(user_lastName)
	}, [user_firstName, user_lastName])

	navigation.setOptions({
		title: `Editar - ${firstName}`,
	})

	const [customerUpdate, { loading, error, data }] = useMutation(CUSTOMER_UPDATE, {
		onCompleted: (data) => {
			if (Platform.OS === 'android')
				ToastAndroid.show('Se actualizó el usuario.', ToastAndroid.LONG)
			dispatch(
				setUser({
					...user_state,
					firstName: firstName,
					lastName: lastName,
				})
			)
			navigation.navigate('Profile')
		},
		onError: (error) => {
			if (Platform.OS === 'android')
				ToastAndroid.show('Error actualizando el perfil.', ToastAndroid.LONG)
			navigation.navigate('Profile')
			console.log('Error customerUpdate >> ', error)
		}
	})

	const hasErrors = (key) => (errors.includes(key) ? styles.hasErrors : null)

	const handleEdit = () => {
		let error_data = []

		if (firstName.length == 0) error_data.push('firstName')
		if (lastName.length == 0) error_data.push('lastName')

		if (error_data.length > 0) setErrors(error_data)
		else {
			customerUpdate({
				variables: {
					id: user_id,
					firstName: firstName,
					lastName: lastName,
				},
			})
		}
	}

	return (
		<View style={styles.container}>
			<View>
				<Typography
					color={colors.ON_SURFACE_VARIANT}
					style={{ marginVertical: 10 }}
				>
					Nombre
				</Typography>
				<TextInput
					value={firstName}
					style={[
						styles.input,
						hasErrors('firstName'),
						{ color: colors.ON_BACKGROUND },
					]}
					onChangeText={(text) => setFirstName(text)}
				/>
			</View>
			<View>
				<Typography
					color={colors.ON_SURFACE_VARIANT}
					style={{ marginVertical: 10 }}
				>
					Apellidos
				</Typography>
				<TextInput
					value={lastName}
					style={[
						styles.input,
						hasErrors('lastName'),
						{ color: colors.ON_BACKGROUND },
					]}
					onChangeText={(text) => setLastName(text)}
				/>
			</View>
			<Button
				style={{ alignItems: 'center', marginVertical: 16 }}
				onPress={() => handleEdit()}
			>
				<Typography color="#ffffff">Editar</Typography>
			</Button>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	input: {
		borderRadius: 0,
		borderWidth: 0,
		borderBottomColor: '#8E8E8E',
		borderBottomWidth: StyleSheet.hairlineWidth,
		height: 45,
	},
	hasErrors: {
		borderBottomColor: '#CF6679',
	},
})
