import { useEffect, useState } from 'react'
import {
	ActivityIndicator,
	Keyboard,
	TextInput,
	KeyboardAvoidingView,
	StyleSheet,
	View,
	Platform,
	TouchableOpacity,
	ScrollView,
} from 'react-native'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useTheme } from '@react-navigation/native'
import { useDispatch } from 'react-redux'

import { Button, Typography } from '../../components'
import { TOKEN_CREATE, GET_CARRIER_BY_USER_EMAIL } from '../../graphql/login'
import { login, setCarrierInfo } from '../../redux/userlogin/userLoginSlice'
import Colors from '../../constants/Colors'

//import Pushy from 'pushy-react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

export default function LoginScreen({ navigation }) {
	const dispatch = useDispatch()
	const { colors } = useTheme()

	const [email, setEmail] = useState('')
	const [loadingButton, setLoadingButton] = useState(false)
	const [password, setPassword] = useState('')
	const [errors, setErrors] = useState([])
	const [errorLogin, setErrorLogin] = useState(false)
	const [isSecure, setIsSecure] = useState(true)
	const [secureIcon, setSecureIcon] = useState('eye-slash')
	const [errorMessage, setErrorMessage] = useState("")
	const [token, setToken] = useState(null)
	const [pushyToken, setPushyToken] = useState(null)


	const hasErrors = (key) => (errors.includes(key) ? styles.hasErrors : null)

	useEffect(() => {
		// Register the user for push notifications
		/* Pushy.register().then(async (deviceToken) => {
			// Display an alert with device token
			setPushyToken(deviceToken)
			console.log('Pushy device token: ' + deviceToken);

			// Send the token to your backend server via an HTTP GET request
			//await fetch('https://your.api.hostname/register/device?token=' + deviceToken);

			// Succeeded, optionally do something to alert the user
		}).catch((err) => {
			// Handle registration errors
			console.error('Error en tomando pushy.me Token', err);
		}); */
	}, [])

	useEffect(() => {
		setErrors([])
		setErrorLogin(false)
		setErrorMessage('')
	}, [email, password])

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
		onError: (errorToken, dataToken) => {
			setLoadingButton(false)
			setErrorLogin(true)
			setErrorMessage(`Error de conexión >>> ${errorToken}`)
			console.log('ERROR LOGIN errorToken >> ', JSON.stringify(errorToken, null, 2))
			console.log('ERROR LOGIN dataToken >> ', JSON.stringify(dataToken,null, 2))
		},
		fetchPolicy: "no-cache"
	})

	const handleLogin = (vEmail, vPassword) => {
		if (email == '') {
			setErrors(['email'])
			setErrorLogin(true)
			setErrorMessage(`El correo es obligatorio.`)
		} else {
			setLoadingButton(true)
			Keyboard.dismiss()
			tokenCreate({ variables: { email: vEmail, password: vPassword } })
		}
	}

	const changeSecure = () => {
		setIsSecure(!isSecure)
		if (isSecure) {
			setSecureIcon('eye')
		} else {
			setSecureIcon('eye-slash')
		}
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
		<View style={{ flex: 1 }}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				//style={{ flex: 1, backgroundColor: 'red' }}
				keyboardVerticalOffset={10}
			>
				<ScrollView
					style={{ padding: 40 }}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps='handled'
				>
					<View style={{ alignItems: 'center' }}>
						<Typography color={colors.ON_BACKGROUND} style={styles.title}>
							Iniciar Sesión
						</Typography>
					</View>
					<View style={{ marginTop: 100 }}>
						<Typography
							//color={colors.ON_SURFACE_VARIANT}
							style={[hasErrors('email'), { marginVertical: 10 }]}
						>
							Correo
						</Typography>
						<TextInput
							keyboardType='email-address'
							autoCapitalize='none'
							caretHidden={false}
							value={email}
							style={[
								styles.input,
								hasErrors('email'),
								{
									color: colors.ON_BACKGROUND,
									borderBottomColor: '#8E8E8E',
									borderBottomWidth: StyleSheet.hairlineWidth,
								},
							]}
							onChangeText={(text) => setEmail(text)}
						/>
					</View>
					<View style={{ marginTop: 20 }}>
						<Typography
							color={colors.ON_SURFACE_VARIANT}
							style={[hasErrors('email'), { marginVertical: 10 }]}
						>
							Contraseña
						</Typography>
						<View style={{
							flexDirection: 'row',
							borderBottomColor: '#8E8E8E',
							borderBottomWidth: StyleSheet.hairlineWidth,
						}}>
							<TextInput
								secureTextEntry={isSecure}
								value={password}
								style={[
									styles.input,
									hasErrors('password'),
									{ color: colors.ON_BACKGROUND, flex: 1 },
								]}
								onChangeText={(text) => setPassword(text)}
							/>
							<TouchableOpacity onPress={() => changeSecure()}>
								<FontAwesome
									style={{ marginTop: 10 }}
									name={secureIcon}
									size={24}
								//color={colors.SURFACE}
								/>
							</TouchableOpacity>

						</View>

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
								Crear cuenta.
							</Typography>
						</Button>
					</View>
					{/* <Typography>
				Pushy.me Token {pushyToken}
			</Typography> */}
				</ScrollView>
			</KeyboardAvoidingView>
		</View>

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
		height: 45,
		fontSize: 16,
	},
	hasErrors: {
		borderBottomColor: '#CF6679',
		color: '#CF6679',
	},
})
