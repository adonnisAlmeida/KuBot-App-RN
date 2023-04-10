import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Modal, StatusBar, StyleSheet, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
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
import { printCreated } from '../../utils/CommonFunctions'
import { TimePickerInputLineal } from '../../components/DatePickerInput'
import { SelectLine } from '../../components/Select'
import MySelect from '../../components/MySelect'
moment.locale('es')

const localRules = [
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
		"id": "UnVsZrg0",
		"name": "Never",
		"nameSpanish": "Única vez",
		"label": "Única vez",
		"description": "Repeat never",
		"frequency": "NEVER",
		"serverId": 5,
		"value": 5
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
	const [canUpdate, setCanUpdate] = useState(true)
	const [titulo, setTitulo] = useState('Evento creado desde la App')
	const [eventId, setEventId] = useState(null)
	//const [dropText, setDropText] = useState('Seleccione una regla')
	const [eventServerId, setEventServerId] = useState(null)
	const [eventStart, setEventStart] = useState(null)
	const [descripcion, setDescripcion] = useState('')
	const [inicioFull, setInicioFull] = useState(null)
	const [inicio, setInicio] = useState('')
	const [inicioNoHuman, setInicioNoHuman] = useState(null)
	const [finNoHuman, setFinNoHuman] = useState(null)
	const [finFull, setFinFull] = useState(null)
	const [fin, setFin] = useState('')
	const [fechaFin, setFechaFin] = useState('')
	const [fechaFinErrorText, setFechaFinErrorText] = useState('')
	const [selectedRule, setSelectedRule] = useState(5) // 5 porque es el serverId de la regla nunca que no esta creada en el back
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
	const [editModal, setEditModal] = useState(false)
	const [deleteModal, setDeleteModal] = useState(false)
	const [updateModal, setUpdateModal] = useState(false)
	const [selectedAction, setSelectedAction] = useState(0)
	const [toastMessage, setToastMessage] = useState('')
	const [isUpdateHalf, setIsUpdateHalf] = useState(false)
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
		/* if (eventServerId) {
			setShowAlert(false)
			setDisplayLoading(true)
			console.log("eventServerId ", eventServerId)
			deleteDeliverySchedules({ variables: { id: eventServerId } })
		} */
		if (eventServerId) {
			switch (selectedAction) {
				case 1: // este y eventos futuros
					const dateArray = date_param.split("-");
					setDisplayLoading(true)
					setDeleteModal(false)
					setToastMessage("Evento Eliminado correctamente")
					updateDeliverySchedule({
						variables: {
							id: eventId,
							start: inicioNoHuman,
							end: finNoHuman,
							endRecurringPeriod: new Date(dateArray[0], dateArray[1] - 1, dateArray[2] - 1),
							description: descripcion,
							title: titulo,
							rule: (selectedRule == 0) ? null : selectedRule,
						}
					})
					break;
				case 2: // todos los eventos
					setDisplayLoading(true)
					setDeleteModal(false)
					console.log("ELIMINAR EVENTO >> eventServerId ", eventServerId)
					deleteDeliverySchedules({ variables: { id: eventServerId } })
					break;
				case 0: // por defecto este no debe ocurrir

					break;

				default:
					break;
			}
		}
	}

	const deleteEvent = () => {
		setDeleteModal(true)
	}

	const updateEvent = () => {
		setUpdateModal(true)
	}

	const doUpdate = () => {
		if (eventServerId) {
			switch (selectedAction) {
				case 1: // modifica todos los eventos de la serie
					setDisplayLoading(true)
					setToastMessage("Evento actualizado correctamente")
					handleUpdate()
					break;
				case 2: // modificar este y los futuros
					setIsUpdateHalf(true)
					setDisplayLoading(true)
					setToastMessage("Evento actualizado correctamente")
					updateDeliverySchedule({
						variables: {
							id: eventId,
							start: inicioNoHuman,
							end: finNoHuman,
							endRecurringPeriod: new Date(dateArray[0], dateArray[1] - 1, dateArray[2] - 1),
							description: descripcion,
							title: titulo,
							rule: (selectedRule == 0) ? null : selectedRule,
						}
					})
					break;
				case 0: // por defecto este no debe ocurrir

					break;

				default:
					break;
			}
		}
	}

	const userStore = useSelector(state => state.userlogin)
	const carrierID = userStore.carrierInfo.serverId;

	const [createDeliverySchedule, { loadingCreate, errorCreate, dataCreate }] = useMutation(CREATE_DELIVERY_SCHEDULE, {
		onCompleted: (dataCreate) => {
			if (dataCreate.eventCreate.event) {
				let eventCreated = {
					"node": dataCreate.eventCreate.event
				}
				/* console.log("dataCreate.eventCreate.event >> ", dataCreate.eventCreate.event)
				console.log("dataCreate.eventCreate.event >> ", dataCreate.eventCreate)
				console.log("dataCreate.eventCreate.event >> ", dataCreate.eventCreate.error) */
				dispatch(addDeliberySchedulesSource(eventCreated))
				if (Platform.OS === 'android')
					ToastAndroid.show(toastMessage, ToastAndroid.LONG)
				setNewLoadingcreate(false)
				handleReset()
				if (isUpdateHalf) {
					setIsUpdateHalf(false)
				}
				navigation.navigate('DeliverySchedulesScreen', {
					makeReload: 'KAKA',
				})
			}else{
				if (Platform.OS === 'android')
					ToastAndroid.show("Ha ocurrido un error", ToastAndroid.LONG)
			}
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
			if (isUpdateHalf) {
				handleAdd()
			} else {
				navigation.navigate('DeliverySchedulesScreen', {
					makeReload: 'KAKA',
				})
				if (Platform.OS === 'android')
					ToastAndroid.show(toastMessage, ToastAndroid.LONG)

				handleReset()
				setDisplayLoading(false)
				setNewLoadingUpdate(false)
			}

		},
		onError: (errorUpdated) => {
			console.log('ERRORRRRR ACTUALIZANDO EVENT >>> ', errorUpdated.message)
			setNewLoadingUpdate(false)
			setDisplayLoading(false)
		}
	})

	useEffect(() => {
		if (event_details) { // cuando es editar un evento
			console.log('EVENT Details >> ', event_details)
			if (event_details.rule == null) {
				setSelectedRule(0)
			} else {
				setSelectedRule(event_details.rule.serverId)
			}
			setIsDetails(true)
			setCanUpdate(false)
			setTitulo(event_details.title)
			setEventId(event_details.id)
			setEventServerId(event_details.serverId)
			setDescripcion(event_details.description)
			let humanStart = moment(event_details.start).format('h:mm a')
			setInicio(humanStart)
			setInicioNoHuman(event_details.start)
			let humanEnd = moment(event_details.end).format('h:mm a')
			setFin(humanEnd)
			setFinNoHuman(event_details.end)
			let humanDateEnd = moment(event_details.endRecurringPeriod).format('YYYY-MM-DD')
			setFechaFin(humanDateEnd)
			let humaneventStart = moment(event_details.start).format('YYYY-MM-DD')
			setEventStart(humaneventStart)
			navigation.setOptions({
				title: `Detalles del evento`,
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
		if (selectedRule != 5) {
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
					endRecurringPeriod: (selectedRule == 5) ? finDate : fechaFinOK,
					rule: (selectedRule == 5) ? null : selectedRule,
					carrier: carrierID,
				}
			})
			/* console.log("A Crear con >> ", {
				start: inicioDate,
				end: finDate,
			})
			setNewLoadingcreate(false) */
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
		if (selectedRule != 5) {
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
		const definitivoInicioOtro = new Date(parseInt(eventStartSplit[0]), parseInt(eventStartSplit[1]) - 1, parseInt(eventStartSplit[2]), parseInt(inicioArray[0]), parseInt(inicioArray[1]))
		const definitivoFinOtro = new Date(parseInt(eventStartSplit[0]), parseInt(eventStartSplit[1]) - 1, parseInt(eventStartSplit[2]), parseInt(finArray[0]), parseInt(finArray[1]))
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
					start: definitivoInicioOtro,
					end: definitivoFinOtro,
					title: titulo,
					endRecurringPeriod: (selectedRule == 5) ? null : fechaFinOK,
					rule: (selectedRule == 5) ? null : selectedRule,
				}
			})
			/* console.log("Actualizar con esto >>> ", {
				start: definitivoInicio,
				end: definitivoFin,
				startOtro: definitivoInicioOtro,
				endOtro: definitivoFinOtro,
			})
			setNewLoadingUpdate(false) */
		}
	}

	const handleReset = () => {
		setTitulo('')
		setDescripcion('')
		setInicio('')
		setFin('')
		setSelectedRule(localRules[4]) // OJO cambiar el locale por el rules
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
					<View style={{ flex: 1 }}>
						{/* <View style={{ marginBottom: 5 }}>
							{isDetails ? (
								<>
									<Typography bold>
										Desde: {eventStart}
									</Typography>
								</>

							) : (
								<Typography bold>
									Desde: {date_param}
								</Typography>
							)}

						</View> */}
						{isDetails ? (
							<View style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								backgroundColor: '#fff',
								paddingHorizontal: 16,
								paddingVertical: 20,
							}}>
								<Typography>
									Desde
								</Typography>
								<Typography>
									{eventStart}
								</Typography>
							</View>
						) : (
							<View style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								backgroundColor: '#fff',
								paddingHorizontal: 16,
								paddingVertical: 20,
							}}>
								<Typography>
									Desde
								</Typography>
								<Typography>
									{date_param}
								</Typography>
							</View>
						)}
						<View style={{
							backgroundColor: '#fff',
							marginTop: 20,
							paddingHorizontal: 16,
						}}>
							<View style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								paddingVertical: 10,
							}}>
								<TimePickerInputLineal
									label="Hora de Inicio"
									date={inicioFull}
									value={inicio}
									setValue={setInicio}
									error={hasErrors('inicio')}
								/>
							</View>
							<View style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								paddingVertical: 10,
								borderTopColor: '#8E8E8E',
								borderTopWidth: StyleSheet.hairlineWidth,
							}}>
								<TimePickerInputLineal
									date={finFull}
									label="Hora de Fin"
									value={fin}
									setValue={setFin}
									error={hasErrors('fin')}
								/>
							</View>
							{hasErrors('fin') ? (
								<Typography color='#CF6679'>
									{horaErrorText}
								</Typography>
							) : (
								null
							)}
							{/* <View style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								paddingVertical: 10,
								borderTopColor: '#8E8E8E',
								borderTopWidth: StyleSheet.hairlineWidth,
							}}>
								<MySelect
									label="Repetir"
									items={localRules}
									value={selectedRule}
									setValue={setSelectedRule}
								/>
							</View> */}
						</View>


						<View style={{ flexDirection: 'row', marginBottom: 15, marginTop: 10, justifyContent: 'space-between' }}>
							<View style={{ width: '48%' }}>
								{canUpdate ? (
									<TimePickerInput
										date={inicioFull}
										label="Hora de Inicio"
										value={inicio}
										setValue={setInicio}
										error={hasErrors('inicio')}
									/>
								) : (
									<View style={{ marginVertical: 10 }}>
										<Typography bold>Hora de Inicio:</Typography>
										<Typography style={{
											marginVertical: 10,
											borderRadius: 0,
											borderWidth: 0,
											/* borderBottomColor: '#8E8E8E',
											borderBottomWidth: StyleSheet.hairlineWidth, */
											height: 30,
										}}>{inicio}</Typography>
									</View>
								)}
							</View>
							<View style={{ width: '48%' }}>
								{canUpdate ? (
									<TimePickerInput
										date={finFull}
										label="Hora de Fin"
										value={fin}
										setValue={setFin}
										error={hasErrors('fin')}
									/>
								) : (
									<View style={{ marginVertical: 10 }}>
										<Typography bold>Hora de Fin:</Typography>
										<Typography style={{
											marginVertical: 10,
											borderRadius: 0,
											borderWidth: 0,
											/* borderBottomColor: '#8E8E8E',
											borderBottomWidth: StyleSheet.hairlineWidth, */
											height: 30,
										}}>{fin}</Typography>
									</View>
								)}
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
							{canUpdate ? (
								<Select
									label="Repetir"
									items={localRules}
									value={selectedRule}
									setValue={setSelectedRule}
								/>
							) : (
								<View style={{ marginTop: -10 }}>
									<Typography bold>Repetir:</Typography>
									<Typography size={16} style={{
										marginVertical: 10,
										borderRadius: 0,
										borderWidth: 0,
										/* borderBottomColor: '#8E8E8E',
										borderBottomWidth: StyleSheet.hairlineWidth, */
										height: 30,
									}}>{localRules[selectedRule - 1].label}</Typography>
								</View>
							)}
							{selectedRule != 5 ?
								<View>
									{canUpdate ? (
										<DatePickerInput
											label="Fecha de Finalización"
											value={fechaFin}
											setValue={setFechaFin}
											type='date'
											error={hasErrors('fechaFin')}
											date={fechaFin == '' ? date_param : fechaFin}
										/>
									) : (
										<View style={{ marginVertical: 10 }}>
											<Typography bold>Fecha de Finalización:</Typography>
											<Typography style={{
												marginTop: 10,
												borderRadius: 0,
												borderWidth: 0,
												/* borderBottomColor: '#8E8E8E',
												borderBottomWidth: StyleSheet.hairlineWidth, */
												height: 30,
											}}>{fechaFin}</Typography>
										</View>
									)}
									{hasErrors('fechaFin') ? (
										<Typography color='#CF6679' style={{ marginTop: 5 }}>
											{fechaFinErrorText}
										</Typography>
									) : null}
								</View>
								: null}
						</View>
					</View>
					<View>
						{isDetails ?
							(
								canUpdate ? (
									<View style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										backgroundColor: '#fff',
										padding: 16,
										borderTopColor: '#8E8E8E',
										borderTopWidth: StyleSheet.hairlineWidth,
									}}>
										<Button
											color={'#e6e6e9'}
											style={{ alignItems: 'center', width: '40%' }}
											onPress={() => {
												setCanUpdate(false)
												setSelectedAction(0)
											}}
										//onPress={() => handleUpdate()}
										>
											<Typography color="#606060">Cancelar</Typography>
										</Button>
										<Button
											color={Colors.COLORS.WEB_BUTTON}
											style={{ alignItems: 'center', width: '40%' }}
											onPress={() => doUpdate()}
										>
											<Typography color="#ffffff">Aceptar</Typography>
										</Button>
									</View>
								) : (
									<View style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										backgroundColor: '#fff',
										padding: 16,
										borderTopColor: '#8E8E8E',
										borderTopWidth: StyleSheet.hairlineWidth,
									}}>
										<Button
											color={Colors.COLORS.WEB_BUTTON}
											style={{ alignItems: 'center', width: '40%' }}
											onPress={() => updateEvent()}
										//onPress={() => handleUpdate()}
										>
											{(newLoadingUpdate) ? (
												<ActivityIndicator size="small" color="white" />
											) : (
												<Typography color="#ffffff">Editar</Typography>
											)}
										</Button>
										<Button
											color="error"
											style={{ alignItems: 'center', width: '40%' }}
											onPress={() => deleteEvent()}
										>
											<Typography color="#ffffff">Eliminar</Typography>
										</Button>
									</View>
								)

							) :
							(
								<View style={{
									backgroundColor: '#fff',
									padding: 16,
									borderTopColor: '#8E8E8E',
									borderTopWidth: StyleSheet.hairlineWidth,
								}}>
									<Button
										color={Colors.COLORS.WEB_BUTTON}
										style={{ alignItems: 'center' }}
										onPress={() => {
											setToastMessage('Horario de reparto creado correctamente.')
											handleAdd()
										}}
									>
										{(newLoadingCreate) ? (
											<ActivityIndicator size="small" color="white" />
										) : (
											<Typography color="#ffffff">Adicionar</Typography>
										)}
									</Button>
								</View>
							)}
					</View>

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
			<Modal
				visible={deleteModal}
				transparent={true}
				animationType="slade"
				onRequestClose={() => {
					setDeleteModal(false)
					setSelectedAction(0)
				}}
			>
				<TouchableOpacity
					style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', }}
					onPressOut={() => {
						setDeleteModal(false)
						setSelectedAction(0)
					}}
				>
					<View style={styles.modalContent}>
						<View style={{
							alignItems: 'center',
							alignContent: 'center',
							marginBottom: 20,
							marginTop: 10
						}}>
							<Typography h2 color={'#000'}>¿Eliminar Evento?</Typography>
						</View>

						<View style={{ flex: 1 }}>
							<TouchableOpacity
								style={{
									marginTop: 5,
									paddingVertical: 5,
								}}
								onPress={() => setSelectedAction(1)}
							>
								<Typography h3
									color={selectedAction == 1 ? Colors.COLORS.WEB_BUTTON : '#606060'}>
									{selectedAction == 1 ? '>' : '  '} Este y eventos futuros
								</Typography>
							</TouchableOpacity>
							<TouchableOpacity
								style={{
									marginTop: 10,
									paddingVertical: 5,
								}}
								onPress={() => setSelectedAction(2)}
							>
								<Typography h3
									color={selectedAction == 2 ? Colors.COLORS.WEB_BUTTON : '#606060'}
								>
									{selectedAction == 2 ? '>' : '  '} Todos los eventos
								</Typography>
							</TouchableOpacity>
						</View>

						<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
							<Button
								color={'#e6e6e9'}
								style={{ alignItems: 'center', width: '40%' }}
								onPress={() => {
									setDeleteModal(false)
									setSelectedAction(0)
								}}
							>
								<Typography color="#606060">Cancelar</Typography>
							</Button>
							<Button
								color={Colors.COLORS.WEB_BUTTON}
								style={{ alignItems: 'center', width: '40%' }}
								onPress={() => doDelete()}
							>
								<Typography color="#fff">Aceptar</Typography>
							</Button>
						</View>

					</View>
				</TouchableOpacity>
			</Modal>
			<Modal
				visible={updateModal}
				transparent={true}
				animationType="slade"
				onRequestClose={() => {
					setUpdateModal(false)
					setSelectedAction(0)
				}}
			>
				<TouchableOpacity
					style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', }}
					onPressOut={() => {
						setUpdateModal(false)
						setSelectedAction(0)
					}}
				>
					<View style={[styles.modalContent, { height: 200, }]}>
						<View style={{
							alignItems: 'center',
							alignContent: 'center',
							marginBottom: 20,
							marginTop: 10
						}}>
							<Typography h2 color={'#000'}>Detalles</Typography>
						</View>

						<View style={{ flex: 1 }}>
							<TouchableOpacity
								style={{
									marginTop: 5,
									paddingVertical: 5,
								}}
								onPress={() => {
									setUpdateModal(false)
									setSelectedAction(1)
									setCanUpdate(true)
								}}
							>
								<Typography h3>Modificar todos los eventos en la serie</Typography>
							</TouchableOpacity>
							<TouchableOpacity
								style={{
									marginTop: 15,
									paddingVertical: 5,
								}}
								onPress={() => {
									setUpdateModal(false)
									setSelectedAction(2)
									setCanUpdate(true)
								}}
							>
								<Typography h3>Modificar este y todos los eventos futuros</Typography>
							</TouchableOpacity>
						</View>

						{/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
							<Button
								color={'#e6e6e9'}
								style={{ alignItems: 'center', borderRadius: 10, padding: 10, paddingHorizontal: 25 }}
								onPress={() => {
									setUpdateModal(false)
									setSelectedAction(0)
								}}
							>
								<Typography h3 color="#606060">Cancelar</Typography>
							</Button>
							<Button
								color={Colors.COLORS.WEB_BUTTON}
								style={{ alignItems: 'center', borderRadius: 10, padding: 10, paddingHorizontal: 25 }}
								//onPress={() => doDelete()}
								onPress={() => {
									setUpdateModal(false)
									setCanUpdate(true)
								}}
							>
								<Typography h3 color="#fff">Aceptar</Typography>
							</Button>
						</View> */}

					</View>
				</TouchableOpacity>
			</Modal>
		</>
	)
}

const styles = StyleSheet.create({
	modalContent: {
		/* borderWidth: 1,
		borderColor: '#000', */
		borderBottomWidth: 0,
		padding: 15,
		paddingHorizontal: 25,
		backgroundColor: '#FFF',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: 250,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
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
		//padding: 16,
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
