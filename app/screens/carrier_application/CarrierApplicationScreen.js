import { View, Text, ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet, ScrollView, TouchableOpacity, Platform, ToastAndroid } from 'react-native'
import React from 'react'
import StepIndicator from 'react-native-step-indicator';
import Colors from '../../constants/Colors';
import { Typography } from '../../components';
import { useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { DELIVERY_ZONES } from '../../graphql/deliveryAreas';
import { CARRIER_REGISTER } from '../../graphql/login';
import { useEffect } from 'react';
import FirstComponent from './components/FirstComponent'
import SecondComponent from './components/SecondComponent'
import { useRef } from 'react';
import { containsOnlyNumbers } from '../../utils/CommonFunctions';
import { COUNTRIES } from '../../constants/Other';
import { useDispatch } from 'react-redux';
import { setCarrierInfo } from '../../redux/userlogin/userLoginSlice';

const CarrierApplicationScreen = ({ navigation }) => {
	const [currentPosition, setCurrentPosition] = useState(0)
	const [piPhotoFrontal, setPiPhotoFrontal] = useState(require('../../../assets/user_avatar.png'))
	const [piPhotoBack, setPiPhotoBack] = useState(require('../../../assets/user_avatar.png'))
	const [bustPhoto, setBustPhoto] = useState(require('../../../assets/user_avatar.png'))
	const [piPhotoFrontalFile, setPiPhotoFrontalFile] = useState(null)
	const [piPhotoBackFile, setPiPhotoBackFile] = useState(null)
	const [bustPhotoFile, setBustPhotoFile] = useState(null)
	const [errors, setErrors] = useState([])
	const [nombre, setNombre] = useState('')
	const [apellidos, setApellidos] = useState('')
	const [pais, setPais] = useState(57)
	const [provincia, setProvincia] = useState(1)
	const [municipio, setMunicipio] = useState('')
	const [direccion1, setDireccion1] = useState('')
	const [direccion2, setDireccion2] = useState('')
	const [codigoPostal, setCodigoPostal] = useState('')
	const [telefono, setTelefono] = useState('')
	const [codigoTelefono, setCodigoTelefono] = useState(57)
	const [carnet, setCarnet] = useState('')
	const [empresa, setEmpresa] = useState('')
	const [provinciasList, setProvinciasList] = useState([])
	const [registerCarrier, setRegisterCarrier] = useState(false)
	const [loadingZones, setLoadingZones] = useState(false)
	const dispatch = useDispatch()

	const hasErrors = (key) => (errors.includes(key) ? styles.hasErrors : null)

	const [carrierRegister, { loadingCarrierRegister, errorCarrierRegister, dataCarrierRegister }] = useMutation(CARRIER_REGISTER, {
		onCompleted: (dataCarrierRegister) => {
			setRegisterCarrier(false)
			console.log("OKOK CARRIER REGISTER ", dataCarrierRegister.carrierRegister.carrier)
			dispatch(setCarrierInfo(dataCarrierRegister.carrierRegister.carrier))
			if (Platform.OS === 'android') {
				ToastAndroid.show('Solicitud de cuenta de mensajero enviada.', ToastAndroid.LONG)
			}
			navigation.navigate('Home')
		},
		onError: (errorCarrierRegister, dataCarrierRegister) => {
			setRegisterCarrier(false)
			console.log('ERROR CARRIER REGISTER >> ', JSON.stringify(errorCarrierRegister, null, 2))
			console.log('ERROR CARRIER REGISTER >> dataCarrierRegister', dataCarrierRegister)
		},
		fetchPolicy: "no-cache"
	})

	const [getDeliveryZones, { loadingProvincias, errorProvincias, dataProvincias }] = useLazyQuery(DELIVERY_ZONES, {
		onCompleted: (dataProvincias) => {
			console.log('OnCOmplete OK >>>>', dataProvincias.deliveryZones.edges.length)
			const allResult = dataProvincias.deliveryZones.edges
			let groupedProvinces = []

			allResult.map((prov) => {
				if (prov.node.parent !== null) {
					let flag = false
					groupedProvinces.map((provi, i) => {
						if (prov.node.parent.id == provi.id) {
							provi.municipios.push(prov)
							flag = true
						}
					})
					if (!flag) {
						var father = {
							'id': prov.node.parent.id,
							'name': prov.node.parent.name,
							'municipios': [prov]
						}
						groupedProvinces.push(father)
					}
				}
			})
			if (dataProvincias.deliveryZones.pageInfo.hasNextPage) {
				setProvinciasList(groupedProvinces)
				getDeliveryZones({ variables: { after: dataProvincias.deliveryZones.pageInfo.endCursor, before: '' } })
			} else {
				let temporal = []
				provinciasList.forEach(item => temporal.push(item))
				groupedProvinces.map((groupProv) => {
					let flag = false
					temporal.map((prov) => {
						if (groupProv.name == prov.name) {
							flag = true
							prov.municipios = prov.municipios.concat(groupProv.municipios)
						}
					})
					if (!flag) {
						temporal = temporal.concat(groupProv)
					}
				})
				setProvinciasList(temporal)
				setLoadingZones(false)
			}
		},
		onError: (errorProvincias) => {
			setLoadingZones(false)
			console.log('Error cargando todas las zonas de entrega', errorProvincias)
		}
	})

	useEffect(() => {
		setLoadingZones(true)
		getDeliveryZones({ variables: { after: '', before: '' } })
	}, [])

	const labels = ["Información Personal", "Información de KYC"];
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
					country: COUNTRIES[pais].code,
					countryArea: municipio,
					phone: telefono == ''? '': COUNTRIES[codigoTelefono].mobileCode + telefono,
				}
			}
			setRegisterCarrier(true)
			console.log("Ejecutar consulta con : >>> ", carrierApplication)
			carrierRegister({
				variables: {
					input: {
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
							country: COUNTRIES[pais].code,
							countryArea: municipio,
							phone: telefono,
						}
					}
				}
			})
		}

	}

	const makeNext = () => {
		switch (currentPosition) {
			case 0:
				Keyboard.dismiss()
				let error_data = []
				if (!containsOnlyNumbers(carnet) || carnet.length != 11) {
					error_data.push('carnet')
				}
				/* if (!containsOnlyNumbers(telefono)) {
					error_data.push('telefono')
				} */

				/* if (nombre.length == 0) error_data.push('firstName')
				if (nombre.length == 0) error_data.push('firstName')
				if (apellidos.length == 0) error_data.push('lastName') */
				if (error_data.length > 0) {
					setErrors(error_data)
					console.log("error_data", error_data)
				} else {
					setCurrentPosition(currentPosition + 1)
				}
				break;
			default:
				break;
		}
	}

	return (
		<View style={{ flex: 1 }}>
			<View style={{ marginTop: 10, paddingHorizontal: 10 }}>
				<StepIndicator
					stepCount={2}
					customStyles={customStyles}
					currentPosition={currentPosition}
					labels={labels}
				/>
			</View>
			{currentPosition == 0 ? (
				<FirstComponent
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
					codigoTelefono={codigoTelefono}
					setCodigoTelefono={setCodigoTelefono}
					carnet={carnet}
					setCarnet={setCarnet}
					empresa={empresa}
					setEmpresa={setEmpresa}
					hasErrors={hasErrors}
					setErrors={setErrors}
					errors={errors}
					provinciasList={provinciasList}
					loadingZones={loadingZones}
				/>
			) : (
				<SecondComponent
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
			)}
			<View style={{
				position: 'absolute',
				bottom: 0,
				left: 0,
				right: 0,
				flexDirection: 'row',
				justifyContent: 'space-between',
				paddingVertical: 10,
				paddingHorizontal: 15,
			}}>
				{currentPosition == 1 ? (<TouchableOpacity
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
				</TouchableOpacity>) : (null)}
				<Typography></Typography>
				{currentPosition == 1 ? (
					<TouchableOpacity
						onPress={() => makeCarrier()}
						style={{
							padding: 10,
							borderRadius: 6,
							backgroundColor: Colors.COLORS.PRIMARY,

						}}
					>
						{registerCarrier ? (
							<ActivityIndicator color={'#fff'}></ActivityIndicator>
						) : (
							<Typography color={'#fff'}>
								Crear
							</Typography>
						)}

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
							Siguiente
						</Typography>
					</TouchableOpacity>
				)}
			</View>
		</View >
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

export default CarrierApplicationScreen