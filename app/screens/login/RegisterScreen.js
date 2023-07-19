import { useState, useEffect } from 'react'
import {
	ActivityIndicator,
	TextInput,
	KeyboardAvoidingView,
	StyleSheet,
	View,
	Platform,
	ToastAndroid,
	ScrollView,
	TouchableOpacity,
	Text,
} from 'react-native'
import { useMutation } from '@apollo/client'
import { useTheme } from '@react-navigation/native'

import { ACCOUNT_REGISTER } from '../../graphql/login'
import Colors from '../../constants/Colors'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

export default function RegisterScreen({ navigation }) {
	const { colors } = useTheme()
	const [email, setEmail] = useState('')
	const [emailError, setEmailError] = useState(null)
	const [passError, setPassError] = useState(null)
	const [password, setPassword] = useState('')
	const [repeatPassword, setRepeatPassword] = useState('')
	const [errors, setErrors] = useState([])
	const [isSecure1, setIsSecure1] = useState(true)
	const [isSecure2, setIsSecure2] = useState(true)
	const [secureIcon1, setSecureIcon1] = useState('eye-slash')
	const [secureIcon2, setSecureIcon2] = useState('eye-slash')

	//console.log("user_state TOKEN >>", user_state.token)

	useEffect(() => {
		if (hasErrors('email')) {
			setErrors(pre => pre.filter((key) => key != 'email'))
			setEmailError(null)
		}
	}, [email])

	useEffect(() => {
		if (hasErrors('password')) {
			setErrors(pre => pre.filter((key) => key != 'password'))
			setPassError(null)
		}
	}, [password, repeatPassword])

	const hasErrors = (key) => (errors.includes(key) ? styles.hasErrors : null)

	const [accountRegister, { loading, error, data }] = useMutation(ACCOUNT_REGISTER, {
		onCompleted: (data) => {
			if (data.accountRegister.user == null) {
				//ToastAndroid.show('Usuario nulo.', ToastAndroid.LONG)
				if (data.accountRegister.accountErrors) {
					data.accountRegister.accountErrors.forEach(element => {
						if (element.code === "UNIQUE" && element.field === "email") {
							setEmailError("Este correo está en uso.")
							setErrors(['email'])
						} else if (element.code === "INVALID" && element.field === "email") {
							setEmailError("La dirección de correo no es válida.")
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
				//setCurrentPosition(currentPosition + 1)
				//tokenCreate({ variables: { email: email, password: password } })
				navigation.goBack()
				/* setEmail('')
				setPassword('')
				setRepeatPassword('') */
			}

		},
		onError: (error) => {
			console.log("ERROR REGISTRANDO USUARIO >> ", JSON.stringify(error, null, 2))
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
				//console.log("Son iguales")
			} else {
				const valid = []
				valid.push('password')
				setErrors(valid)
				setPassError('Las contraseñas deben ser idénticas')
			}
		}
	}

	const changeSecure = (input) => {
		if (input == 1) {
			setIsSecure1(!isSecure1)
			if (isSecure1) {
				setSecureIcon1('eye')
			} else {
				setSecureIcon1('eye-slash')
			}
		} else {
			setIsSecure2(!isSecure2)
			if (isSecure2) {
				setSecureIcon2('eye')
			} else {
				setSecureIcon2('eye-slash')
			}
		}

	}

	return (

		<KeyboardAvoidingView
			style={styles.login}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			//keyboardVerticalOffset={0}
		>
			<ScrollView
				keyboardShouldPersistTaps='handled' /* esto hace que sea cliqueable el contenido con el keyboard open */
				showsVerticalScrollIndicator={false}
			>
				<View style={{ alignItems: 'center', }}>
					<Text color={colors.ON_BACKGROUND} style={styles.title}>
						Crear Cuenta
					</Text>
				</View>
				<View style={{ marginTop: 85 }}>
					<Text
						color={colors.ON_SURFACE_VARIANT}
					//style={{ marginVertical: 10 }}
					>
						Correo
					</Text>
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
					{emailError ? (
						<Text small color="red" style={{ marginVertical: 10 }} >
							{emailError}
						</Text>
					) : (null)}
				</View>
				<View style={{ marginTop: 20 }}>
					<Text
						color={colors.ON_SURFACE_VARIANT}
					//style={{ marginVertical: 10 }}
					>
						Contraseña
					</Text>
					<View style={{
						flexDirection: 'row',
						borderBottomColor: '#8E8E8E',
						borderBottomWidth: StyleSheet.hairlineWidth,
					}}>
						<TextInput
							secureTextEntry={isSecure1}
							value={password}
							style={[
								styles.input,
								hasErrors('password'),
								{ color: colors.ON_BACKGROUND, flex: 1 },
							]}
							onChangeText={(text) => setPassword(text)}
						/>
						<TouchableOpacity onPress={() => changeSecure(1)}>
							<FontAwesome
								style={{ marginTop: 10 }}
								name={secureIcon1}
								size={24}
							//color={colors.SURFACE}
							/>
						</TouchableOpacity>
					</View>
				</View>
				<View style={{ marginTop: 20 }}>
					<Text
						color={colors.ON_SURFACE_VARIANT}
					//style={{ marginVertical: 10 }}
					>
						Repetir Contraseña
					</Text>
					<View style={{
						flexDirection: 'row',
						borderBottomColor: '#8E8E8E',
						borderBottomWidth: StyleSheet.hairlineWidth,
					}}>
						<TextInput
							secureTextEntry={isSecure2}
							value={repeatPassword}
							style={[
								styles.input,
								hasErrors('password'),
								{ color: colors.ON_BACKGROUND, flex: 1 },
							]}
							onChangeText={(text) => setRepeatPassword(text)}
						/>
						<TouchableOpacity onPress={() => changeSecure(2)}>
							<FontAwesome
								style={{ marginTop: 10 }}
								name={secureIcon2}
								size={24}
							//color={colors.SURFACE}
							/>
						</TouchableOpacity>
					</View>
				</View>
				{passError ? (
					<Text small color="red" style={{ marginVertical: 10 }} >
						{passError}
					</Text>
				) : (null)}
				<View style={{ marginTop: 50 }}>
					<TouchableOpacity
						style={{ alignItems: 'center', marginBottom: 10 }}
						onPress={() => handleRegister(email, password, repeatPassword)}
					>
						{loading ? (
							<ActivityIndicator size="small" color="white" />
						) : (
							<Text color="#ffffff">Crear Cuenta</Text>
						)}
					</TouchableOpacity>
					<TouchableOpacity
						style={{ alignItems: 'center' }}
						//color="trasparent"
						onPress={() => navigation.navigate('Login')}
					>
						<Text
							color={colors.ON_SURFACE_VARIANT}
							style={{
								textDecorationLine: 'underline',
							}}
						>
							Acceder
						</Text>
					</TouchableOpacity>
				</View>

			</ScrollView>
		</KeyboardAvoidingView>

	)
}

const styles = StyleSheet.create({
	button: {
		padding: 15,
		borderRadius: 100,
		elevation: 5,
		position: 'absolute',
		bottom: 90,
		right: 27,
		backgroundColor: Colors.COLORS.PRIMARY
	},
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
	},
})
