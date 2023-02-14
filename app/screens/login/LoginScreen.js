import React from 'react'
import {
	ActivityIndicator,
	Keyboard,
	TextInput,
	KeyboardAvoidingView,
	StyleSheet,
	View,
	Platform,
} from 'react-native'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useTheme } from '@react-navigation/native'
import { useDispatch } from 'react-redux'

import { Button, Typography } from '../../components'
import { TOKEN_CREATE, GET_CARRIER_BY_USER_EMAIL } from '../../graphql/login'
import { login, setCarrierInfo } from '../../redux/userlogin/userLoginSlice'
import Colors from '../../constants/Colors'
import { ComplexAnimationBuilder } from 'react-native-reanimated'
import { useEffect } from 'react'
import Pushy from 'pushy-react-native';
import { useState } from 'react'

export default function LoginScreen({ navigation }) {
	const dispatch = useDispatch()
	const { colors } = useTheme()

	const [email, setEmail] = React.useState('')
	const [loadingButton, setLoadingButton] = React.useState(false)
	const [password, setPassword] = React.useState('')
	const [errors, setErrors] = React.useState([])
	const [errorLogin, setErrorLogin] = React.useState(false)
	const [errorMessage, setErrorMessage] = React.useState("")
	const [token, setToken] = React.useState(null)
	const [pushyToken, setPushyToken] = useState(null)
	

	const hasErrors = (key) => (errors.includes(key) ? styles.hasErrors : null)

	useEffect(() => {
		// Register the user for push notifications
		Pushy.register().then(async (deviceToken) => {
			// Display an alert with device token
			setPushyToken(deviceToken)
			console.log('Pushy device token: ' + deviceToken);

			// Send the token to your backend server via an HTTP GET request
			//await fetch('https://your.api.hostname/register/device?token=' + deviceToken);

			// Succeeded, optionally do something to alert the user
		}).catch((err) => {
			// Handle registration errors
			console.error('Error en tomando pushy.me Token', err);
		});
	}, [])


	const [tokenCreate, { loadingToken, errorToken, dataToken }] = useMutation(TOKEN_CREATE, {
		onCompleted: (dataToken) => {
			setToken(dataToken.tokenCreate)
			if (dataToken.tokenCreate.token) {
				const user = {
					token: dataToken.tokenCreate.token,
					...dataToken.tokenCreate.user,
				}
				dispatch(login(user))
			} else if (dataToken.tokenCreate.errors) {
				setErrorLogin(true)
				setErrorMessage('Credenciales Incorrectas')
				const valid = []
				valid.push('email')
				valid.push('password')
				setErrors(valid)
			} else {
				setErrorLogin(true)
				setErrorMessage('Error desconocido')
			}
			setLoadingButton(false)
		},
		onError: (errorToken) => {
			setLoadingButton(false)
			setErrorLogin(true)
			setErrorMessage(`Error de conexión >>> ${errorToken}`)
			console.log('ERROR LOGIN >> ', errorToken)
		},
		fetchPolicy: "no-cache"
	})

	const handleLogin = (vEmail, vPassword) => {
		setLoadingButton(true)
		Keyboard.dismiss()
		tokenCreate({ variables: { email: vEmail, password: vPassword } })
	}

	/* React.useEffect(() => {
		if (result.data) setToken(result.data.tokenCreate)
	}, [result]) */

	/* React.useEffect(() => {
		dispatch(setCarrierInfo(data))
	}, [data]) */

	/* React.useEffect(() => {
		if (token) {
			if (token.token) {
				const user = {
					token: token.token,
					...token.user,
				}
				dispatch(login(user))
			} else {
				const valid = []
				valid.push('email')
				valid.push('password')
				setErrors(valid)
			}
		}
	}, [token]) */

	return (
		<KeyboardAvoidingView
			style={styles.login}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<View>
				<Typography color={colors.ON_BACKGROUND} style={styles.title}>
					Iniciar Sesión
				</Typography>
			</View>
			<View style={{ marginTop: 100 }}>
				<Typography
					color={colors.ON_SURFACE_VARIANT}
					style={{ marginVertical: 10 }}
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
			</View>
			<View style={{ marginTop: 20 }}>
				<Typography
					color={colors.ON_SURFACE_VARIANT}
					style={{ marginVertical: 10 }}
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
			{
				errorLogin ? (
					<Typography
						color='#CF6679'
						style={{ marginVertical: 10 }}
					>
						{errorMessage}
					</Typography>) : (<></>)
			}
			<View style={{ marginTop: 50 }}>
				<Button
					style={{ alignItems: 'center', marginBottom: 10 }}
					onPress={() => handleLogin(email, password)}
				>
					{(loadingToken || loadingButton) ? (
						<ActivityIndicator size="small" color="white" />
					) : (
						<Typography color="#ffffff">Acceder</Typography>
					)}
				</Button>
				<Button
					style={{ alignItems: 'center' }}
					color="trasparent"
					onPress={() => navigation.navigate('Register')}
				>
					<Typography
						color={colors.ON_SURFACE_VARIANT}
						style={[
							{
								textDecorationLine: 'underline',
							},
						]}
					>
						Crear Cuenta
					</Typography>
				</Button>
				<Typography>
					Pushy.me Token {pushyToken}
				</Typography>
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
