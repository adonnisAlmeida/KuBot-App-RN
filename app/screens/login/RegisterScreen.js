import React from 'react'
import {
	ActivityIndicator,
	TextInput,
	KeyboardAvoidingView,
	StyleSheet,
	View,
	Platform,
	ToastAndroid,
} from 'react-native'
import { useMutation } from '@apollo/client'
import { useTheme } from '@react-navigation/native'

import { Button, Typography } from '../../components'
import { ACCOUNT_REGISTER } from '../../graphql/login'

export default function RegisterScreen({ navigation }) {
	const { colors } = useTheme()

	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [repeatPassword, setRepeatPassword] = React.useState('')
	const [errors, setErrors] = React.useState([])
	const [emailError, setEmailError] = React.useState(null)
	const [passError, setPassError] = React.useState(null)

	const hasErrors = (key) => (errors.includes(key) ? styles.hasErrors : null)

	const [accountRegister, { loading, error, data }] = useMutation(ACCOUNT_REGISTER, {
		onCompleted: (data) => {
			if (data.accountRegister.user == null) {
				ToastAndroid.show('Usuario nulo.', ToastAndroid.LONG)
				if (data.accountRegister.accountErrors) {
					data.accountRegister.accountErrors.forEach(element => {
						if (element.code === "UNIQUE" && element.field === "email") {
							setEmailError("Este correo está en uso.")
							setErrors(['email'])
						} else if (element.code === "INVALID" && element.field === "email") {
							setEmailError("El correo no es válido.")
							setErrors(['email'])
						} else {
							setEmailError(element.code)
							setErrors(['email'])
						}
					})
				}
			} else {
				if (Platform.OS === 'android') {
					ToastAndroid.show(`Usuario ${email} creado correctamente`, ToastAndroid.LONG)
				}
				setEmail('')
				setPassword('')
				setRepeatPassword('')
				console.log('Se registro correctamente')
				navigation.navigate('Login')
			}

		},
		onError: () => {
			console.log("ERROR REGISTRANDO USUARIO >> ", error)
			if (Platform.OS === 'android') {
				ToastAndroid.show(`Error registrando usuario: ${error}`, ToastAndroid.LONG)
			}
			const valid = []
			valid.push('email')
			valid.push('password')
			setErrors(valid)
			setPassword('')
			setRepeatPassword('')
		},
		fetchPolicy: "no-cache"
	})

	const handleRegister = (vEmail, vPassword, vRepeatPassword) => {
		if (vEmail == "") {
			setEmailError("El correo es requerido.")
			setErrors(['email'])
		} else {
			if (vPassword == vRepeatPassword) {
				accountRegister({ variables: { email: vEmail, password: vPassword } })
			} else {
				const valid = []
				valid.push('password')
				setErrors(valid)
				setPassError('Las contraseñas deben ser idénticas')
			}
		}

	}

	React.useEffect(() => {
		setEmailError(null)
		setErrors([])
	}, [email])

	React.useEffect(() => {
		setPassError(null)
		setErrors([])
	}, [password, repeatPassword])

	return (
		<KeyboardAvoidingView
			style={styles.login}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<View>
				<Typography color={colors.ON_BACKGROUND} style={styles.title}>
					Crear Cuenta
				</Typography>
			</View>
			<View style={{ marginTop: 85 }}>
				<Typography
					color={colors.ON_SURFACE_VARIANT}
				//style={{ marginVertical: 10 }}
				>
					Correo
				</Typography>
				<TextInput
					keyboardType='email-address'
					value={email}
					style={[
						styles.input,
						hasErrors('email'),
						{ color: colors.ON_BACKGROUND },
					]}
					onChangeText={(text) => setEmail(text)}
				/>
				{emailError ? (
					<Typography small color="red" style={{ marginVertical: 10 }} >
						{emailError}
					</Typography>
				) : (null)}
			</View>
			<View style={{ marginTop: 20 }}>
				<Typography
					color={colors.ON_SURFACE_VARIANT}
				//style={{ marginVertical: 10 }}
				>
					Contraseña
				</Typography>
				<TextInput
					secureTextEntry
					value={password}
					style={[
						styles.input,
						hasErrors('password'),
						{ color: colors.ON_BACKGROUND },
					]}
					onChangeText={(text) => setPassword(text)}
				/>
			</View>
			<View style={{ marginTop: 20 }}>
				<Typography
					color={colors.ON_SURFACE_VARIANT}
				//style={{ marginVertical: 10 }}
				>
					Repetir Contraseña
				</Typography>
				<TextInput
					secureTextEntry
					value={repeatPassword}
					style={[
						styles.input,
						hasErrors('password'),
						{ color: colors.ON_BACKGROUND },
					]}
					onChangeText={(text) => setRepeatPassword(text)}
				/>
			</View>
			{passError ? (
				<Typography small color="red" style={{ marginVertical: 10 }} >
					{passError}
				</Typography>
			) : (null)}
			<View style={{ marginTop: 50 }}>
				<Button
					style={{ alignItems: 'center', marginBottom: 10 }}
					onPress={() => handleRegister(email, password, repeatPassword)}
				>
					{loading ? (
						<ActivityIndicator size="small" color="white" />
					) : (
						<Typography color="#ffffff">Crear Cuenta</Typography>
					)}
				</Button>
				<Button
					style={{ alignItems: 'center' }}
					color="trasparent"
					onPress={() => navigation.navigate('Login')}
				>
					<Typography
						color={colors.ON_SURFACE_VARIANT}
						style={{
							textDecorationLine: 'underline',
						}}
					>
						Acceder
					</Typography>
				</Button>
			</View>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	login: {
		flex: 1,
		padding: 40,
	},
	title: {
		fontSize: 30,
		fontWeight: 'bold',
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
