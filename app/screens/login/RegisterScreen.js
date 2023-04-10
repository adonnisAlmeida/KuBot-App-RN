import { useState, useEffect, createRef, useRef } from 'react'
import {
	ActivityIndicator,
	TextInput,
	KeyboardAvoidingView,
	StyleSheet,
	View,
	Platform,
	ToastAndroid,
	TouchableOpacity,
	ScrollView,
	Keyboard,
} from 'react-native'
import { useMutation } from '@apollo/client'
import { useTheme } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { Button, Typography } from '../../components'
import { ACCOUNT_REGISTER, CARRIER_REGISTER, TOKEN_CREATE } from '../../graphql/login'
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import StepIndicator from 'react-native-step-indicator';
import Colors from '../../constants/Colors'
import FirstComponent from './componets/FirstComponent'
import SecondComponent from './componets/SecondComponent'
import ThirdComponent from './componets/ThirdComponent'
import { useDispatch, useSelector } from 'react-redux'
import { login, setToken, user } from '../../redux/userlogin/userLoginSlice'
import { dataDetectorType } from 'deprecated-react-native-prop-types/DeprecatedTextPropTypes'
import { containsOnlyNumbers } from '../../utils/CommonFunctions'

export default function RegisterScreen({ navigation }) {
	const { colors } = useTheme()
	const [piPhotoFrontal, setPiPhotoFrontal] = useState(require('../../../assets/user_avatar.png'))
	const [piPhotoBack, setPiPhotoBack] = useState(require('../../../assets/user_avatar.png'))
	const [bustPhoto, setBustPhoto] = useState(require('../../../assets/user_avatar.png'))
	const [piPhotoFrontalFile, setPiPhotoFrontalFile] = useState(null)
	const [piPhotoBackFile, setPiPhotoBackFile] = useState(null)
	const [bustPhotoFile, setBustPhotoFile] = useState(null)
	const [terminos, setTerminos] = useState(false)
	const [email, setEmail] = useState('')
	const [emailError, setEmailError] = useState(null)
	const [passError, setPassError] = useState(null)
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [avatarURL, setAvatarURL] = useState(require('../../../assets/user_avatar.png'))
	const [password, setPassword] = useState('')
	const [repeatPassword, setRepeatPassword] = useState('')
	const [nombre, setNombre] = useState('')
	const [apellidos, setApellidos] = useState('')
	const [pais, setPais] = useState('')
	const [provincia, setProvincia] = useState('')
	const [municipio, setMunicipio] = useState('')
	const [direccion1, setDireccion1] = useState('')
	const [direccion2, setDireccion2] = useState('')
	const [currentPosition, setCurrentPosition] = useState(0)
	const [codigoPostal, setCodigoPostal] = useState('')
	const [telefono, setTelefono] = useState('')
	const [carnet, setCarnet] = useState('')
	const [empresa, setEmpresa] = useState('')
	const [errors, setErrors] = useState([])
	const firstRef = useRef();
	const secondRef = useRef();
	const thirdRef = useRef();
	const dispatch = useDispatch()
	const user_state = useSelector(user)

	console.log("user_state TOKEN >>", user_state.token)

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
				tokenCreate({ variables: { email: email, password: password } })
				/* setEmail('')
				setPassword('')
				setRepeatPassword('') */
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

	const [tokenCreate, { loadingToken, errorToken, dataToken }] = useMutation(TOKEN_CREATE, {
		onCompleted: (dataToken) => {
			if (dataToken.tokenCreate.token) {
				let token = dataToken.tokenCreate.token
				dispatch(setToken(token))
				setCurrentPosition(currentPosition + 1)
			}
		},
		onError: (errorToken) => {
			console.log('ERROR LOGIN >> ', errorToken)
		},
		fetchPolicy: "no-cache"
	})

	const [carrierRegister, { loadingCarrierRegister, errorCarrierRegister, dataCarrierRegister }] = useMutation(CARRIER_REGISTER, {
		onCompleted: (dataCarrierRegister) => {
			console.log("OKOK CARRIER REGISTER ", dataCarrierRegister)
		},
		onError: (errorCarrierRegister) => {
			console.log('ERROR CARRIER REGISTER >> ', errorCarrierRegister)
			console.log('ERROR CARRIER REGISTER >> dataCarrierRegister', dataCarrierRegister)
		},
		fetchPolicy: "no-cache"
	})

	const labels = ["Información de la Cuenta", "Información Personal", "Información de KYC"];
	const customStyles = {
		stepIndicatorSize: 30,
		currentStepIndicatorSize: 35,
		separatorStrokeWidth: 3,
		currentStepStrokeWidth: 4,
		stepStrokeCurrentColor: '#2bb673',
		stepStrokeWidth: 3,
		stepStrokeFinishedColor: '#2bb673',
		stepStrokeUnFinishedColor: '#aaaaaa',
		separatorFinishedColor: '#2bb673',
		separatorUnFinishedColor: '#aaaaaa',
		stepIndicatorFinishedColor: '#2bb673',
		stepIndicatorUnFinishedColor: '#ffffff',
		stepIndicatorCurrentColor: '#ffffff',
		stepIndicatorLabelFontSize: 15,
		currentStepIndicatorLabelFontSize: 16,
		stepIndicatorLabelCurrentColor: '#2bb673',
		stepIndicatorLabelFinishedColor: '#ffffff',
		stepIndicatorLabelUnFinishedColor: '#aaaaaa',
		labelColor: '#999999',
		labelSize: 14,
		currentStepLabelColor: '#2bb673'
	}

	const makeCarrier = () => {
		let errorData = []
		if (piPhotoFrontalFile == null) {
			errorData.push('piPhotoFrontalFile')
		}
		if (piPhotoBackFile == null) {
			errorData.push('piPhotoBackFile')
		}
		if (bustPhotoFile == null) {
			errorData.push('bustPhotoFile')
		}
		if (errorData.length > 0) {
			setErrors(errorData)
			console.log("TIENE ERRORESSS >> ", errorData)
		} else {
			let carrierApplication = {
				piPhotoFrontal: piPhotoFrontalFile,
				piPhotoBack: piPhotoBackFile,
				bustPhoto: bustPhotoFile,
				address: {
					firstName: nombre,
					lastName: apellidos,
					companyName: empresa,
					streetAddress1: direccion1,
					streetAddress2: direccion2,
					city: provincia,
					cityArea: municipio,
					postalCode: codigoPostal,
					country: pais,
					countryArea: "",
					phone: telefono,
				}
			}
			carrierRegister({ variables: { input: {
				piPhotoFrontal: piPhotoFrontalFile,
				piPhotoBack: piPhotoBackFile,
				bustPhoto: bustPhotoFile,
				address: {
					firstName: nombre,
					lastName: apellidos,
					companyName: empresa,
					streetAddress1: direccion1,
					streetAddress2: direccion2,
					city: provincia,
					cityArea: municipio,
					postalCode: codigoPostal,
					country: "CU",
					countryArea: "",
					phone: telefono,
				}
			} } })
			console.log("Ejecutar consulta con : >>> ", carrierApplication)
		}
	}

	const makeNext = () => {
		switch (currentPosition) {
			case 0:
				Keyboard.dismiss()
				if (email == "") {
					setEmailError("El correo es requerido.")
					setErrors(['email'])
				} else {
					if (password == repeatPassword) {
						//accountRegister({ variables: { email: email, password: password } })
						setCurrentPosition(currentPosition + 1)
					} else {
						const valid = []
						valid.push('password')
						setErrors(valid)
						setPassError('Las contraseñas deben ser idénticas')
					}
				}
				//setCurrentPosition(currentPosition + 1)
				break;
			case 1:
				Keyboard.dismiss()
				if (containsOnlyNumbers(carnet) && carnet.length == 11) {
					setCurrentPosition(currentPosition + 1)
				} else {
					setErrors(['carnet'])
				}
				/* let error_data = []
				if (firstName.length == 0) error_data.push('firstName')
				if (lastName.length == 0) error_data.push('lastName')
				if (error_data.length > 0) setErrors(error_data)
				else {
					setCurrentPosition(currentPosition + 1)
				} */

				break;
			default:
				break;
		}
	}

	return (
		<View style={{ flex: 1 }}>
			<View style={{ marginTop: 10, paddingHorizontal: 10 }}>
				<StepIndicator
					stepCount={3}
					customStyles={customStyles}
					currentPosition={currentPosition}
					labels={labels}
				/>
			</View>
			<KeyboardAvoidingView
				style={styles.login}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={100}
			>
				<ScrollView style={{ flex: 1, paddingTop: 20, paddingHorizontal: 20 }}>
					{currentPosition == 0 ? (
						<FirstComponent
							emailError={emailError}
							setEmailError={setEmailError}
							passError={passError}
							setPassError={setPassError}
							email={email}
							hasErrors={hasErrors}
							errors={errors}
							setErrors={setErrors}
							setEmail={setEmail}
							setPassword={setPassword}
							password={password}
							repeatPassword={repeatPassword}
							setRepeatPassword={setRepeatPassword}
							ref={firstRef}
						/>
					) : (
						currentPosition == 1 ? (
							<SecondComponent
								nombre={nombre}
								setNombre={setNombre}
								apellidos={apellidos}
								setApellidos={setApellidos}
								pais={pais}
								setPais={setPais}
								provincia={provincia}
								setProvincia={setProvincia}
								municipio={municipio}
								setMunicipio={setMunicipio}
								direccion1={direccion1}
								setDireccion1={setDireccion1}
								direccion2={direccion2}
								setDireccion2={setDireccion2}
								codigoPostal={codigoPostal}
								setCodigoPostal={setCodigoPostal}
								telefono={telefono}
								setTelefono={setTelefono}
								carnet={carnet}
								setCarnet={setCarnet}
								empresa={empresa}
								setEmpresa={setEmpresa}
								hasErrors={hasErrors}
								setErrors={setErrors}
								/* firstName={firstName}
								lastName={lastName}
								setLastName={setLastName}
								setFirstName={setFirstName}
								hasErrors={hasErrors}
								setErrors={setErrors}
								avatarURL={avatarURL}
								setAvatarURL={setAvatarURL} */
								ref={secondRef}
							/>
						) : (
							<ThirdComponent
								ref={thirdRef}
								terminos={terminos}
								setTerminos={setTerminos}
								piPhotoFrontal={piPhotoFrontal}
								setPiPhotoFrontal={setPiPhotoFrontal}
								piPhotoBack={piPhotoBack}
								setPiPhotoBack={setPiPhotoBack}
								bustPhoto={bustPhoto}
								setBustPhoto={setBustPhoto}
								piPhotoFrontalFile={piPhotoFrontalFile}
								piPhotoBackFile={piPhotoBackFile}
								bustPhotoFile={bustPhotoFile}
								setPiPhotoFrontalFile={setPiPhotoFrontalFile}
								setPiPhotoBackFile={setPiPhotoBackFile}
								setBustPhotoFile={setBustPhotoFile}
								hasErrors={hasErrors}
								setErrors={setErrors}
							/>
						)
					)}
				</ScrollView>
			</KeyboardAvoidingView>
			<View style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				padding: 15,
			}}>
				{currentPosition <= 1 ? (null) : (
					<TouchableOpacity
						onPress={() => setCurrentPosition(currentPosition - 1)}
						style={{
							padding: 10,
							borderRadius: 6,
							backgroundColor: 'rgba(0,0,0,0.1)',

						}}
					>
						<Typography color={'rgba(0,0,0,0.7)'} >
							Anterior
						</Typography>
					</TouchableOpacity>
				)}
				<Typography></Typography>
				{currentPosition == 2 ? (
					<TouchableOpacity
						onPress={() => makeCarrier()}
						style={{
							padding: 10,
							borderRadius: 6,
							backgroundColor: Colors.COLORS.PRIMARY,

						}}
					>
						<Typography color={'#fff'}>
							Crear
						</Typography>
					</TouchableOpacity>
				) : (
					<TouchableOpacity
						onPress={() => makeNext()}
						style={{
							padding: 10,
							borderRadius: 6,
							backgroundColor: Colors.COLORS.WEB_START_OFF,
						}}
					>
						<Typography color={'rgba(0,0,0,0.7)'}>
							{loading ? (
								<ActivityIndicator color={'rgba(0,0,0,0.7)'} />
							) : (
								'Siguiente'
							)}

						</Typography>
					</TouchableOpacity>
				)}
			</View>
			<TouchableOpacity
				onPress={() => navigation.navigate('Login')}
				style={[styles.button]}
			>
				<MaterialCommunityIcons
					name={'login'}
					size={25}
					color={colors.SURFACE}
				/>
			</TouchableOpacity>
		</View >
	)

	/* return (
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
	) */
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
		//padding: 15,
	},
	/* login: {
		flex: 1,
		padding: 40,
	}, */
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
