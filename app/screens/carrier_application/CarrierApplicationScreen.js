import { View, Text, ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
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

const CarrierApplicationScreen = () => {
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
	const [carnet, setCarnet] = useState('')
	const [empresa, setEmpresa] = useState('')
	const [provinciasList, setProvinciasList] = useState([])
	const [provinciasListUltimo, setProvinciasListUltimo] = useState(null)
	const [registerCarrier, setRegisterCarrier] = useState(false)

	const abortController = new AbortController();

	const firstRef = useRef();
	const secondRef = useRef();
	const thirdRef = useRef();

	const hasErrors = (key) => (errors.includes(key) ? styles.hasErrors : null)

	useEffect(() => {
		getDeliveryZones({ variables: { after: '', before: '' } })
	}, [])

	const [carrierRegister, { loadingCarrierRegister, errorCarrierRegister, dataCarrierRegister }] = useMutation(CARRIER_REGISTER, {
		onCompleted: (dataCarrierRegister) => {
			setRegisterCarrier(false)
			console.log("OKOK CARRIER REGISTER ", dataCarrierRegister)
		},
		onError: (errorCarrierRegister) => {
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

			allResult.map((prov, index) => {
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
				} else {
				}
			})

			if (dataProvincias.deliveryZones.pageInfo.hasNextPage) {
				setProvinciasListUltimo(groupedProvinces.slice(-1))
				groupedProvinces.pop()
				setProvinciasList(groupedProvinces)
				getDeliveryZones({ variables: { after: dataProvincias.deliveryZones.pageInfo.endCursor, before: '' } })
			} else {
				let primeroConsulta = groupedProvinces[0]
				if (provinciasListUltimo[0].name == primeroConsulta.name) {
					provinciasListUltimo[0].municipios.map((mun) => {
						primeroConsulta.municipios.push(mun)
						let finalGrouped = provinciasList.concat(groupedProvinces)
						setProvinciasList(finalGrouped)
					})
				}
			}

		},
		onError: () => {
			console.log('Error cargando todas las zonas de entrega', errorProvincias)
		}
	})

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
		/* if (errorData.length > 0) {
			setErrors(errorData)
			console.log("TIENE ERRORESSS >> ", errorData)
		} else { */
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
							country: "CU",
							countryArea: "",
							phone: telefono,
						}
					}
				}
			})
		/* } */
		
	}

	const makeNext = () => {
		switch (currentPosition) {
			case 0:
				Keyboard.dismiss()
				/* if (containsOnlyNumbers(carnet) && carnet.length == 11) {
					setCurrentPosition(currentPosition + 1)
				} else {
					setErrors(['carnet'])
				} */
				/* let error_data = []
				if (firstName.length == 0) error_data.push('firstName')
				if (lastName.length == 0) error_data.push('lastName')
				if (error_data.length > 0) setErrors(error_data)
				else {
					setCurrentPosition(currentPosition + 1)
				} */
				setCurrentPosition(currentPosition + 1)
				break;
			case 1:
				/* Keyboard.dismiss()
				if (containsOnlyNumbers(carnet) && carnet.length == 11) {
					setCurrentPosition(currentPosition + 1)
				} else {
					setErrors(['carnet'])
				} */
				/* let error_data = []
				if (firstName.length == 0) error_data.push('firstName')
				if (lastName.length == 0) error_data.push('lastName')
				if (error_data.length > 0) setErrors(error_data)
				else {
					setCurrentPosition(currentPosition + 1)
				} */
				setCurrentPosition(currentPosition + 1)
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
			<KeyboardAvoidingView
				style={styles.login}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={100}
			>
				<ScrollView style={{ flex: 1, paddingTop: 20, paddingHorizontal: 20 }}>
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
							carnet={carnet}
							setCarnet={setCarnet}
							empresa={empresa}
							setEmpresa={setEmpresa}
							hasErrors={hasErrors}
							setErrors={setErrors}
							provinciasList={provinciasList}
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
						<SecondComponent
							ref={thirdRef}
							/* terminos={terminos}
							setTerminos={setTerminos} */
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
				</ScrollView>
				<View style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					padding: 15,
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
			</KeyboardAvoidingView >

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