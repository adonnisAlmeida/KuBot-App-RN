import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, StatusBar, StyleSheet, TextInput, ToastAndroid, View } from 'react-native'
import {
	Typography,
	Button,
	Input,
	TimePickerInput,
	Select,
	Loading,
	NetworkError,
	DatePickerInput
} from '../../components'
import { useTheme } from '@react-navigation/native'
import { useLazyQuery, useMutation } from '@apollo/client'
import { CREATE_DELIVERY_SCHEDULE, DELETE_DELIVERY_SCHEDULE, GET_DELIVERY_SCHEDULE_RULES, UPDATE_DELIVERY_SCHEDULE } from '../../graphql/deliverySchedule'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import AwesomeAlert from 'react-native-awesome-alerts'
import { GET_DELIVERY_SCHEDULE } from '../../graphql/deliverySchedule'
import Colors from '../../constants/Colors'
import { addDeliberySchedulesSource, delivery_schedules_list, delivery_schedules_source, getDeliberySchedules, removeDeliberySchedulesSource, setDeliberySchedules, setDeliberySchedulesSource, updateDeliberySchedulesSource } from '../../redux/deliberyschedules/deliberyschedulesSlice'
import { applyRules, stringToColour } from '../../utils/CommonFunctions'
import SelectDropdown from 'react-native-select-dropdown'
import Theme from '../../constants/Theme'
moment.locale('es')

const localRules = [
	{
		"id": "UnVsZrg0",
		"name": "Never",
		"nameSpanish": "Única vez",
		"label": "Única vez",
		"description": "Repeat never",
		"frequency": "NEVER",
		"serverId": 5,
		"value": 5
	},
	{
		"id": "UnVsZTo0",
		"name": "Daily",
		"nameSpanish": "A diario",
		"label": "A diario",
		"description": "Repeat daily",
		"frequency": "DAILY",
		"serverId": 4,
		"value": 4
	},
	{
		"id": "UnVsZToz",
		"name": "Weekly",
		"nameSpanish": "Semanalmente",
		"label": "Semanalmente",
		"description": "Repeat weekly",
		"frequency": "WEEKLY",
		"serverId": 3,
		"value": 3
	},
	{
		"id": "UnVsZToy",
		"name": "Monthly",
		"nameSpanish": "Mensualmente",
		"label": "Mensualmente",
		"description": "Repeat monthly",
		"frequency": "MONTHLY",
		"serverId": 2,
		"value": 2
	},
	{
		"id": "UnVsZTox",
		"name": "Yearly",
		"nameSpanish": "Anualmente",
		"label": "Anualmente",
		"description": "Repeat yearly",
		"frequency": "YEARLY",
		"serverId": 1,
		"value": 1
	},
]
const localRulesOther = ["Nunca", "Anualmente", "Mensualmente", "Semanalmente", "A diario"]

export default function DeliverySchedulesFormScreen({ navigation, route }) {
	let date_param = route.params?.date
	const dateArray = date_param.split("-");
	//console.log('date_param >> ', date_param)
	let event_details = route.params?.event
	const [loadingApp, setLoadingApp] = useState(false)
	const [isDetails, setIsDetails] = useState(false)
	const [titulo, setTitulo] = useState('Evento creado desde la App')
	const [eventId, setEventId] = useState(null)
	//const [dropText, setDropText] = useState('Seleccione una regla')
	const [eventServerId, setEventServerId] = useState(null)
	const [eventStart, setEventStart] = useState(null)
	const [descripcion, setDescripcion] = useState('')
	const [inicioFull, setInicioFull] = useState(null)
	const [inicio, setInicio] = useState('')
	const [finFull, setFinFull] = useState(null)
	const [fin, setFin] = useState('')
	const [fechaFin, setFechaFin] = useState('')
	const [fechaFinErrorText, setFechaFinErrorText] = useState('')
	const [selectedRule, setSelectedRule] = useState(0) // 0 porque es el serverId de la regla nunca que no esta creada en el back
	const [rules, setRules] = useState([])
	const [errors, setErrors] = useState([])
	const { colors } = useTheme()
	const [alertMessage, setAlertMessage] = useState(null)
	const [alertTitle, setAlertTitle] = useState(null)
	const [showAlertAw, setShowAlert] = useState(false)
	const [newLoadingCreate, setNewLoadingcreate] = useState(false)
	const [newLoadingUpdate, setNewLoadingUpdate] = useState(false)
	const [displayLoading, setDisplayLoading] = useState(false)
	const [horaErrorText, setHoraErrorText] = useState('')
	const dispatch = useDispatch()

	//console.log('date Param >> ', date_param)

	let delivery_schedules = useSelector(delivery_schedules_list)
	let schedules_source = useSelector(delivery_schedules_source)

	const [deleteDeliverySchedules, { loadingDelete, errorDelete, dataDelete }] = useMutation(DELETE_DELIVERY_SCHEDULE, {
		onCompleted: (dataDelete) => {
			console.log("dataDelete ", dataDelete)
			dispatch(removeDeliberySchedulesSource(eventId))
			/* let newData = {}
			Object.entries(delivery_schedules).forEach(([key, value]) => {
				var filtered = value.filter(function (item, index, arr) {
					return item.id != eventId;
				});
				newData[key] = filtered
			});
			handleReset()
			console.log('newData >> ', newData)
			dispatch(setDeliberySchedules(newData)) */
			setDisplayLoading(false)
			setLoadingApp(false)
			setShowAlert(false)
			if (Platform.OS === 'android')
				ToastAndroid.show('Evento eliminado correctamente.', ToastAndroid.LONG)
			navigation.navigate('DeliverySchedulesScreen', {
				makeReload: 'KAKA',
			})
		},
		onError: () => {
			console.log('Error eliminando deleteDeliverySchedules >> ', errorDelete)
			console.log('Error eliminando deleteDeliverySchedules >> ', dataDelete)
			setLoadingApp(false)
			setDisplayLoading(false)
		}
	})

	const doDelete = () => {
		if (eventServerId) {
			setShowAlert(false)
			setDisplayLoading(true)
			console.log("eventServerId ", eventServerId)
			deleteDeliverySchedules({ variables: { id: eventServerId } })
		}
	}

	const deleteEvent = () => {
		setAlertMessage(`¿Esta seguro que desea eliminar el evento de horario?`)
		setAlertTitle('¿Estás seguro?')
		setShowAlert(true)
	}

	/* useEffect(() => {
		console.log("delivery_schedules_source >", schedules_source)
	},[schedules_source]) */

	const userStore = useSelector(state => state.userlogin)
	const carrierID = userStore.carrierInfo.serverId;

	/* const [getDeliveryScheduleRules, { loading, error, data }] = useLazyQuery(GET_DELIVERY_SCHEDULE_RULES, {
		onCompleted: (data) => {
			const dataRules = data.rules.edges
			let ruleShow = []
			dataRules.map((item, index) => {
				ruleShow.push(item.node)
			})
			ruleShow.push({
				"id": "UnHrFllO",
				"name": "Never",
				"description": "Repeat never",
				"frequency": "NEVER",
				"serverId": 5
			})
			setLoadingApp(false)
			setRules(ruleShow)
		},
		onError: () => {
			setLoadingApp(false)
		}
	}) */

	const [createDeliverySchedule, { loadingCreate, errorCreate, dataCreate }] = useMutation(CREATE_DELIVERY_SCHEDULE, {
		onCompleted: (dataCreate) => {
			let eventCreated = {
				"node": dataCreate.eventCreate.event
			}
			dispatch(addDeliberySchedulesSource(eventCreated))
			if (Platform.OS === 'android')
				ToastAndroid.show('Se adicionó correctamente el horario de reparto.', ToastAndroid.LONG)
			setNewLoadingcreate(false)
			handleReset()
			navigation.navigate('DeliverySchedulesScreen', {
				makeReload: 'KAKA',
			})
		},
		onError: (errorCreate) => {
			setNewLoadingcreate(false)
			console.log('ERRORRRRR CREATING EVENT >>> ', errorCreate.message)
		}
	})

	const [updateDeliverySchedule, { loadingUpdated, errorUpdated, dataUpdated }] = useMutation(UPDATE_DELIVERY_SCHEDULE, {
		onCompleted: (dataUpdated) => {
			let eventUpdated = {
				"node": dataUpdated.eventUpdate.event
			}
			dispatch(updateDeliberySchedulesSource(eventUpdated))
			navigation.navigate('DeliverySchedulesScreen', {
				makeReload: 'KAKA',
			})
			if (Platform.OS === 'android')
				ToastAndroid.show('Se actualizó correctamente el horario de reparto.', ToastAndroid.LONG)

			handleReset()

			setNewLoadingUpdate(false)
		},
		onError: (errorUpdated) => {
			console.log('ERRORRRRR ACTUALIZANDO EVENT >>> ', errorUpdated.message)
			setNewLoadingUpdate(false)
		}
	})

	/* const [createDeliverySchedule, { loadingCreate, errorCreate, dataCreate }] = useMutation(CREATE_DELIVERY_SCHEDULE, {
		onCompleted: (dataCreate) => {
			let eventCreated = dataCreate.eventCreate.event
			const theKey = moment(eventCreated.start).format('YYYY-MM-DD')
			let finalEvent = {}
			finalEvent[theKey] = []
			finalEvent[theKey].push(eventCreated)
			console.log('finalEvent >>> ', finalEvent)
			//let allEvents = applyRules(finalEvent, delivery_schedules)
			let ruledEvents = applyRules(finalEvent, {})
			var allEvents = {}
			Object.entries(ruledEvents).forEach(([key, value]) => { // esto es porque se que solo tiene un elemento
				Object.entries(delivery_schedules).forEach(([keyLocation, valueLocation]) => {
					if (keyLocation === key) {
						let others = []
						valueLocation.map((key, value) => { others.push(value) })
						//allEvents[keyLocation] = valueLocation
						allEvents[keyLocation] = others
						allEvents[keyLocation].push(value[0])
					} else {
						allEvents[keyLocation] = valueLocation
					}
				})
			})
			console.log('allEvents antes >>> ', allEvents)
			allEvents = {
				...ruledEvents,
				...allEvents
			};
			console.log('allEvents >>> ', allEvents)
			dispatch(setDeliberySchedules(allEvents))
			if (Platform.OS === 'android')
				ToastAndroid.show('Se adicionó el horario de reparto.', ToastAndroid.LONG)

			handleReset()
			navigation.navigate('DeliverySchedulesScreen')
		},
		onError: (errorCreate) => {
			console.log('ERRORRRRR CREATING EVENT >>> ', errorCreate.message)
		}
	}) */

	const prueba = () => {
		let ruledEvents = {
			"2022-11-02": [
				{
					"serverId": 97,
				},
			],
			"2022-11-03": [
				{
					"serverId": 97,
				},
			],
			"2022-10-04": [
				{
					"serverId": 97,
				},
			],
		}
		let delStorage = {
			"2022-10-04": [
				{
					"serverId": 94,
				},
			],
			"2022-10-05": [
				{
					"serverId": 94,
				},
			],
			"2022-10-06": [
				{
					"serverId": 94,
				},
			],
		}
		let allEvents = {}
		Object.entries(ruledEvents).forEach(([key, value]) => { // esto es porque se que solo tiene un elemento
			Object.entries(delStorage).forEach(([keyLocation, valueLocation]) => {
				if (keyLocation === key) {
					console.log('IGUALES KEY')
					allEvents[keyLocation] = valueLocation
					allEvents[keyLocation].push(value[0])
				} else {// si no esta creo la key
					console.log(`DISTINTAS KEY  a guardar >> ${keyLocation} la otra ${key}`)
					allEvents[keyLocation] = valueLocation
				}
			})
		})

		allEvents = {
			...ruledEvents,
			...allEvents
		};

		console.log('allEvents >> ', allEvents)
	}

	/* navigation.setOptions({
		headerStyle: {
			backgroundColor: stringToColour(localRules[selectedRule] ? localRules[selectedRule].name : 'Never') + '99'
		},
	}) */

	useEffect(() => {
		if (event_details) { // cuando es editar un evento
			console.log('EVENT Details >> ', event_details)
			if (event_details.rule == null) {
				setSelectedRule(0)
			} else {
				setSelectedRule(event_details.rule.serverId)
			}
			setIsDetails(true)
			setTitulo(event_details.title)
			setEventId(event_details.id)
			setEventServerId(event_details.serverId)
			setDescripcion(event_details.description)
			let humanStart = moment(event_details.start).format('h:mm a')
			setInicio(humanStart)
			let humanEnd = moment(event_details.end).format('h:mm a')
			setFin(humanEnd)
			let humanDateEnd = moment(event_details.endRecurringPeriod).format('YYYY-MM-DD')
			setFechaFin(humanDateEnd)
			let humaneventStart = moment(event_details.start).format('YYYY-MM-DD')
			setEventStart(humaneventStart)
			navigation.setOptions({
				title: `Actualizar Evento`,
				/* headerStyle: {
					backgroundColor: stringToColour(localRules[selectedRule] ? localRules[selectedRule].name : 'Never') + '40'
				}, */
			})
		}
	}, [])

	useEffect(() => {
		let fechaFinOK = new Date(fechaFin)
		fechaFinOK.setDate(fechaFinOK.getDate() + 1);
		let inicioDate = null

		if (isDetails) {
			let eventStartSplit = eventStart.split("-");
			inicioDate = new Date(eventStartSplit[0], eventStartSplit[1] - 1, eventStartSplit[2]);
		} else {
			inicioDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
		}
		//console.log(`inicio date ${inicioDate} fin date ${fechaFinOK}`, eventStartSplit)
		if (inicioDate > fechaFinOK) {
			const index = errors.indexOf('fechaFin');
			if (index == -1) { // tiene error y no esta declarado
				setErrors(previousState => {
					return [...previousState, 'fechaFin']
				})
				setFechaFinErrorText("Fecha de finalización tiene que ser mayor a la de inicio")
			}
		} else {
			const index = errors.indexOf('fechaFin');
			if (index > -1) {
				let temp = errors.filter(err => err != 'fechaFin')
				setErrors(temp)
			}
		}
	}, [fechaFin])

	useEffect(() => {
		if (inicio != '') {
			const myinicioArray = inicio.split(" ");
			const inicioArray = myinicioArray[0].split(":");
			setInicioFull(new Date(dateArray[0], dateArray[1] - 1, dateArray[2], /* parseInt(inicioArray[0]) - 4 */inicioArray[0], inicioArray[1]))
		}
		setErrors([])
		setHoraErrorText('')
	}, [inicio])

	useEffect(() => {
		if (fin != '') {
			const myfinArray = fin.split(" ");
			const finArray = myfinArray[0].split(":");
			setFinFull(new Date(dateArray[0], dateArray[1] - 1, dateArray[2], finArray[0], finArray[1]))
		}
		setErrors([])
		setHoraErrorText('')
	}, [fin])

	const hasErrors = (key) => errors.includes(key)

	const handleAdd = () => {
		let error_data = []
		//if (descripcion.length == 0) error_data.push('descripcion')
		//if (titulo.length == 0) error_data.push('titulo')
		if (!inicio) error_data.push('inicio')
		if (!fin) error_data.push('fin')
		if (selectedRule != 0) {
			if (!fechaFin) error_data.push('fechaFin')
		}
		const myinicioArray = inicio.split(" ");
		let fechaFinOK = new Date(fechaFin)
		fechaFinOK.setDate(fechaFinOK.getDate() + 1);
		const inicioArray = myinicioArray[0].split(":");
		const myfinArray = fin.split(" ");
		const finArray = myfinArray[0].split(":");
		//const dateArray = date_param.split("-");
		if (myinicioArray[1] == 'pm') {
			if (inicioArray[0] != '12') {
				inicioArray[0] = parseInt(inicioArray[0]) + 12
			}
		} else if (myinicioArray[1] == 'am') {
			if (inicioArray[0] == '12') {
				inicioArray[0] = '00'
			}
		}
		if (myfinArray[1] == 'pm') {
			if (finArray[0] != '12') {
				finArray[0] = parseInt(finArray[0]) + 12
			}
		} else if (myfinArray[1] == 'am') {
			if (finArray[0] == '12') {
				finArray[0] = '00'
			}
		}
		const inicioDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], inicioArray[0], inicioArray[1]);
		const finDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], finArray[0], finArray[1]);
		if (inicioDate > fechaFinOK) {
			error_data.push('fechaFin') // no es necesario porque pueden ser de dias diferentes
			setFechaFinErrorText("Fecha de finalización tiene que ser mayor a la de inicio.")
		}
		if (inicioDate >= finDate) {
			error_data.push('inicio')
			error_data.push('fin')
			setHoraErrorText('La hora de inicio debe ser menor a la de fin.')
		}
		//prueba()
		if (error_data.length > 0) {
			setErrors(error_data)
		} else {
			setErrors([])
			setNewLoadingcreate(true)
			createDeliverySchedule({
				variables: {
					description: descripcion,
					start: inicioDate,
					end: finDate,
					title: titulo,
					endRecurringPeriod: (selectedRule == 0) ? finDate : fechaFinOK,
					rule: (selectedRule == 0) ? null : selectedRule,
					carrier: carrierID,
				}
			})
			/* let test = new Date()
			console.log(`A crear con start: ${inicioDate},
			end: ${finDate},
			endRecurringPeriod: ${(selectedRule == 0) ? finDate : fechaFinOK},
			rule: ${(selectedRule == 0) ? null : selectedRule},
			fechafin: ${fechaFinOK},
			test: ${test},
			carrier: ${carrierID}`) */
		}
	}

	const handleUpdate = () => {
		console.log('titulo >> ', titulo)
		let error_data = []
		//if (descripcion.length == 0) error_data.push('descripcion')
		//if (titulo.length == 0) error_data.push('titulo')
		if (!inicio) error_data.push('inicio')
		if (!fin) error_data.push('fin')
		if (selectedRule != 0) {
			if (!fechaFin) error_data.push('fechaFin')
		}
		let splitFechaFin = fechaFin.split("-");
		const myinicioArray = inicio.split(" ");
		const fechaFinOK = new Date(splitFechaFin[0], splitFechaFin[1] - 1, splitFechaFin[2], 18, 59, 59)
		const inicioArray = myinicioArray[0].split(":");
		const myfinArray = fin.split(" ");
		const finArray = myfinArray[0].split(":");
		//const dateArray = date_param.split("-");
		if (myinicioArray[1] == 'pm') {
			if (inicioArray[0] != '12') {
				inicioArray[0] = parseInt(inicioArray[0]) + 12
			}
		} else if (myinicioArray[1] == 'am') {
			if (inicioArray[0] == '12') {
				inicioArray[0] = '00'
			}
		}
		if (myfinArray[1] == 'pm') {
			if (finArray[0] != '12') {
				finArray[0] = parseInt(finArray[0]) + 12
			}
		} else if (myfinArray[1] == 'am') {
			if (finArray[0] == '12') {
				finArray[0] = '00'
			}
		}
		let eventStartSplit = eventStart.split("-");
		const inicioDate = new Date(eventStartSplit[0], eventStartSplit[1] - 1, eventStartSplit[2], inicioArray[0], inicioArray[1]);
		const finDate = new Date(eventStartSplit[0], eventStartSplit[1] - 1, eventStartSplit[2], finArray[0], finArray[1]);
		const definitivoInicio = new Date(parseInt(eventStartSplit[0]), parseInt(eventStartSplit[1]) - 1, parseInt(eventStartSplit[2]), parseInt(inicioArray[0]) - 5, parseInt(inicioArray[1]))
		const definitivoFin = new Date(parseInt(eventStartSplit[0]), parseInt(eventStartSplit[1]) - 1, parseInt(eventStartSplit[2]), parseInt(finArray[0]) - 5, parseInt(finArray[1]))
		if (inicioDate > fechaFinOK) {
			error_data.push('fechaFin') // no es necesario porque pueden ser de dias diferentes
			setFechaFinErrorText("Fecha de finalización tiene que ser mayor a la de inicio")
		}
		if (definitivoInicio >= definitivoFin) {
			error_data.push('inicio')
			error_data.push('fin')
			setHoraErrorText('La hora de inicio debe ser menor a la de fin.')
		}
		//prueba()
		if (error_data.length > 0) {
			setErrors(error_data)
		} else {
			setNewLoadingUpdate(true)
			updateDeliverySchedule({
				variables: {
					id: eventId,
					description: descripcion,
					start: definitivoInicio,
					end: definitivoFin,
					title: titulo,
					endRecurringPeriod: (selectedRule == 0) ? null : fechaFinOK,
					rule: (selectedRule == 0) ? null : selectedRule,
				}
			})
		}
	}

	const handleReset = () => {
		setTitulo('')
		setDescripcion('')
		setInicio('')
		setFin('')
		setSelectedRule(localRules[0]) // OJO cambiar el locale por el rules
	}

	const reloadApp = () => {
		setLoadingApp(true)
	}

	setTimeout(() => {
		if (loadingApp) setLoadingApp(false)
	}, 2000)

	//if (rules.length == 0 || loading || loadingApp) return <Loading />

	return (
		<>
			{/* <StatusBar
				backgroundColor={stringToColour(localRules[selectedRule] ? localRules[selectedRule].name : 'Never') + '40'}
			/> */}
			<View style={styles.container}>
				{/* {error ?
				(
					<NetworkError accion={reloadApp} />
				) :
				( */}
				<>
					{/* <View style={{ marginBottom: 5 }}>
					<Input
						label="Título"
						value={titulo}
						setValue={setTitulo}
						error={hasErrors('titulo')}
					/>
				</View>
				<View style={{ marginBottom: 5 }}>
					<Input
						label="Descripción"
						value={descripcion}
						setValue={setDescripcion}
						error={hasErrors('descripcion')}
					/>
				</View> */}
					{/* <View style={{ marginBottom: 5 }}>
					<Input
						label="Desde"
						value="dessddd"
						editable = {false}
					/>
				</View> */}
					<View style={{ marginBottom: 5 }}>
						{isDetails ? (
							<>
								<Typography>
									Desde: {eventStart}
								</Typography>
								{/* <Typography>
									SERVER ID: {eventServerId}
								</Typography> */}
							</>

						) : (
							<Typography>
								Desde: {date_param}
							</Typography>
						)}

					</View>
					<View style={{ flexDirection: 'row', marginBottom: 15, marginTop: 10, justifyContent: 'space-between' }}>
						<View style={{ width: '48%' }}>
							<TimePickerInput
								date={inicioFull}
								label="Hora de Inicio"
								value={inicio}
								setValue={setInicio}
								error={hasErrors('inicio')}
							/>
						</View>
						<View style={{ width: '48%' }}>
							<TimePickerInput
								date={finFull}
								label="Hora de Fin"
								value={fin}
								setValue={setFin}
								error={hasErrors('fin')}
							/>
						</View>
					</View>
					{hasErrors('fin') ? (
						<Typography color='#CF6679'>
							{horaErrorText}
						</Typography>
					) : (
						null
					)}

					<View style={{ marginBottom: 10 }}>
						{/* <Typography
						color={colors.ON_SURFACE_VARIANT}
						style={[{ marginVertical: 10 }]}
					>
						Regla
					</Typography> */}
						<Select
							label="Repetir"
							items={localRules}
							value={selectedRule}
							setValue={setSelectedRule}
						//error={hasErrors('repetir')}
						/>
						{/* <SelectDropdown
						defaultButtonText={dropText}
						buttonStyle={styles.select_button}
						ref={dropdownRef}
						defaultValue={selectedRule}
						data={localRulesOther}
						onSelect={(selectedItem, index) => {
							console.log(selectedItem, index)
							setSelectedRule(index)
						}}
						buttonTextAfterSelection={(selectedItem, index) => {
							// text represented after item is selected
							// if data array is an array of objects then return selectedItem.property to render after item is selected
							return selectedItem
						}}
						rowTextForSelection={(item, index) => {
							// text represented for each item in dropdown
							// if data array is an array of objects then return item.property to represent item in dropdown
							return item
						}}
					/> */}
						{/* <Select
						label="Regla"
						//items={rules} // oJO dejar este que los carga del back
						items={localRules}
						value={selectedRule}
						setValue={setSelectedRule}
						error={hasErrors('selectedRule')}
					/> */}
					</View>
					{selectedRule != 0 ?
						<View>
							<DatePickerInput
								label="Fecha de Finalización"
								value={fechaFin}
								setValue={setFechaFin}
								type='date'
								error={hasErrors('fechaFin')}
								date={fechaFin == '' ? date_param : fechaFin}
							/>
							{hasErrors('fechaFin') ? (
								<Typography color='#CF6679' style={{ marginTop: 5 }}>
									{fechaFinErrorText}
								</Typography>
							) : null}
						</View>
						: <></>}
					{isDetails ?
						(
							<>
								<Button
									style={{ alignItems: 'center', marginVertical: 16 }}
									onPress={handleUpdate}
								>
									{(newLoadingUpdate) ? (
										<ActivityIndicator size="small" color="white" />
									) : (
										<Typography color="#ffffff">Actualizar</Typography>
									)}
								</Button>
								<Button
									color="error"
									style={{ alignItems: 'center' }}
									onPress={deleteEvent}
								>
									<Typography color="#ffffff">Eliminar</Typography>
								</Button>
							</>
						) :
						(
							<>
								<Button
									style={{ alignItems: 'center', marginVertical: 16 }}
									onPress={handleAdd}
								>
									{(newLoadingCreate) ? (
										<ActivityIndicator size="small" color="white" />
									) : (
										<Typography color="#ffffff">Adicionar</Typography>
									)}
								</Button>
							</>
						)}
					<AwesomeAlert
						show={showAlertAw}
						title={alertTitle}
						message={alertMessage}
						closeOnTouchOutside={false}
						closeOnHardwareBackPress={false}
						showCancelButton={true}
						showConfirmButton={true}
						cancelText="Cancelar"
						confirmText="Eliminar"
						confirmButtonColor={Colors.COLORS.ERROR}
						onCancelPressed={() => {
							setShowAlert(false)
						}}
						onConfirmPressed={() => {
							doDelete()
						}}
					/>
				</>
				{displayLoading ? (
					<View style={styles.loadingAccept}>
						<ActivityIndicator size={50} color={colors.PRIMARY} />
					</View>
				) : (null)}
				{/* )
			} */}
			</View >
		</>

	)
}

const styles = StyleSheet.create({
	loadingAccept: {
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		backgroundColor: 'rgba(52, 52, 52, 0.5)',
		zIndex: 5,
		elevation: 3,
	},
	select_button: {
		width: '100%',
		backgroundColor: Theme.LIGHT.BACKGROUND,
		borderBottomColor: '#8E8E8E',
		height: 40,
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	container: {
		flex: 1,
		padding: 16,
	},
	text_area: {
		height: 72,
		textAlignVertical: 'top',
		borderRadius: 0,
		borderWidth: 0,
		borderBottomColor: '#8E8E8E',
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	input: {
		borderRadius: 0,
		borderWidth: 0,
		borderBottomColor: '#8E8E8E',
		borderBottomWidth: StyleSheet.hairlineWidth,
		height: 45,
	},
})
