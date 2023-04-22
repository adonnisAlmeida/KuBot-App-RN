import React, { useEffect, useMemo, useState } from 'react'
import { Platform, SafeAreaView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { useTheme } from '@react-navigation/native'

import Agenda from './components/Agenda'
import useAlert from '../../hooks/useAlert'
import { FloatingActionButton, Loading, NetworkError } from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import { FloatingAction } from "react-native-floating-action";

import moment from 'moment'
import { delivery_schedules_list, setDeliberySchedules, setDeliberySchedulesSource } from '../../redux/deliberyschedules/deliberyschedulesSlice'
import { useLazyQuery, useMutation } from '@apollo/client'
import { DELETE_DELIVERY_SCHEDULE, GET_DELIVERY_SCHEDULE } from '../../graphql/deliverySchedule'
import AwesomeAlert from 'react-native-awesome-alerts'
import { applyRules } from '../../utils/CommonFunctions'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Colors from '../../constants/Colors'
import { DirectiveLocation } from 'graphql'
moment.locale('es')

const otherData = {
	"events": {
		"edges": [
			{
				"node": {
					"serverId": 27,
					"start": "2022-11-01T04:00:00+00:00",
					"end": "2023-12-03T04:00:00+00:00",
					"title": "evento ANUAL",
					"description": "Prueba evento ANUAL RULE 1",
					"createdOn": "2022-11-13T22:29:01.188253+00:00",
					"updatedOn": "2022-11-13T22:29:01.188274+00:00",
					"rule": {
						"name": "Yearly",
						"description": "Repeat yearly",
						"frequency": "YEARLY",
						"serverId": 1
					},
					"id": "RXZlbnQ6Mjc="
				}
			},
			{
				"node": {
					"serverId": 26,
					"start": "2022-11-02T04:00:00+00:00",
					"end": "2022-11-21T04:00:00+00:00",
					"title": "evento SEMANAL",
					"description": "Prueba evento SEMANAL RULE 3",
					"createdOn": "2022-11-13T22:28:14.994947+00:00",
					"updatedOn": "2022-11-13T22:28:14.994965+00:00",
					"rule": {
						"name": "Weekly",
						"description": "Repeat weekly",
						"frequency": "WEEKLY",
						"serverId": 3
					},
					"id": "RXZlbnQ6MjY="
				}
			}
		]
	}
}

export default function DeliverySchedulesScreen({ navigation, route }) {
	const { dark, colors } = useTheme()
	const [loadingApp, setLoadingApp] = useState(false)
	const [day, setDay] = useState(moment().format('YYYY-MM-DD'))
	const [myDeliverySchedule, setMyDeliverySchedule] = useState({})
	const [eventToDelete, setEventToDelete] = useState(null)
	const [alertMessage, setAlertMessage] = useState(null)
	const [alertTitle, setAlertTitle] = useState(null)
	const [showAlertAw, setShowAlert] = useState(false)
	const [refreshing, setRefreshing] = useState(false)
	const dispatch = useDispatch()

	const actionIcon = (name) => {
		return (
			<FontAwesome
				name={name}
				size={18}
				color={colors.SURFACE}
			/>
		)
	}

	const actionsButton = [
		{
			text: "Actualizar",
			icon: actionIcon('refresh'),
			name: "bt_update",
			position: 2,
			color: Colors.COLORS.PRIMARY
		},
		{
			text: "Agregar Evento",
			icon: actionIcon('calendar'),
			name: "bt_add_event",
			position: 1,
			color: Colors.COLORS.PRIMARY
		}
	];

	const deliveryScheduleState = useSelector(state => state.deliberyschedules)
	let delivery_schedules = useSelector(delivery_schedules_list)
	const userStore = useSelector(state => state.userlogin)
	const carrierID = userStore.carrierInfo.serverId;

	const [getDeliverySchedule, { loading, error, data }] = useLazyQuery(GET_DELIVERY_SCHEDULE, {
		onCompleted: (data) => {
			console.log('TERMINOO >> ', data.events.edges)
			//console.log("EJECUTOOOOOOOOOOO")
			const todo = data.events.edges
			dispatch(setDeliberySchedulesSource(todo))
			/* const groupedItems = todo.reduce((results, item) => {
				const from = moment(item.node.start).format('YYYY-MM-DD')
				//const stringKey = from.toString()

				if (true)
					(results[moment(item.node.start).format('YYYY-MM-DD')] = results[moment(item.node.start).format('YYYY-MM-DD')] || []).push(item.node)
				return results
			}, {})
			let result = applyRules(groupedItems, {})
			setMyDeliverySchedule(result)
			dispatch(setDeliberySchedules(result)) */
			setLoadingApp(false)
			setRefreshing(false)
		},
		onError: () => {
			console.log('Error listando los eventos >> ', error)
			setLoadingApp(false)
			setRefreshing(false)
		},
		fetchPolicy: "no-cache"
	})

	const datosPrueba = () => { // hace la funcion del complete de la query de grahql
		const todo = otherData.events.edges
		const groupedItems = todo.reduce((results, item) => {
			const from = moment(item.node.start).format('YYYY-MM-DD')
			const stringKey = from.toString()
			if (true)
				(results[stringKey] = results[stringKey] || []).push(item.node)

			return results
		}, {})
		let result = applyRules(groupedItems, {})
		setMyDeliverySchedule(result)
		dispatch(setDeliberySchedules(result))
		setLoadingApp(false)
	}

	useEffect(() => {
		//datosPrueba()
		getDeliverySchedule({ variables: { carrierServerId: carrierID } })
	}, [])

	useEffect(() => {
		//console.log("CAMIO LOS DATOS DE AGENDA")
		setRefreshing(false)
	}, [myDeliverySchedule])

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			// do something
			let makeReload = route.params?.makeReload
			//console.log("ENTRO navigation.addListener ", makeReload)
			if(makeReload == 'KAKA'){
				console.log('Hello World!')
			}
			//setRefreshing(true)
			//getDeliverySchedule({ variables: { carrierServerId: carrierID } })
		});
		return unsubscribe;
	}, [navigation]);



	/* useEffect(() => {
		setMyDeliverySchedule(deliveryScheduleState.list)
	}, [deliveryScheduleState.list]) */
	useEffect(() => {
		//console.log('DESDE LA FUENTE >> ', deliveryScheduleState.source)
		if (deliveryScheduleState.source.length > 0) {
			//console.log('DESDE LA FUENTE >> ENTROOO', deliveryScheduleState.source.length)
			const groupedItems = deliveryScheduleState.source.reduce((results, item) => {
				const from = moment(item.node.start).format('YYYY-MM-DD')
				const stringKey = from.toString()
				if (true)
					(results[stringKey] = results[stringKey] || []).push(item.node)
				return results
			}, {})
			//console.log('groupedItems >> ', groupedItems)
			let result = applyRules(groupedItems, {})
			//console.log("ESte groupedItems >> ", groupedItems)
			//console.log("ESte es con la regla aplicada >> ", result)
			setMyDeliverySchedule(result)
			dispatch(setDeliberySchedules(result))
		} else {
			setMyDeliverySchedule({})
			dispatch(setDeliberySchedules({}))
		}

	}, [deliveryScheduleState.source])

	const { alert, showAlert, hideAlert } = useAlert({
		title: '¿Estas Seguro?',
		subtitle: 'Se eliminará el evento de la agenda',
		buttons: [
			{
				title: 'Eliminar',
				style: 'delete',
				onPress: () => {
					deleteEvent('Eliminado')
					hideAlert()
				},
			},
			{
				title: 'Cancelar',
				style: 'cancel',
			},
		],
	})

	const doRefresh = () => {
		setRefreshing(true)
		getDeliverySchedule({ variables: { carrierServerId: carrierID } })
	}

	const deleteDay = (item) => {
		setEventToDelete(item)
		/* setAlertMessage(`Esta seguro que desea eliminar el evento de horario "${item.title}"`)
		setAlertTitle('¿Estas Seguro?')
		setShowAlert(true) */
		showAlert()
	}

	const doAction = (action) => {
		switch (action) {
			case 'bt_add_event':
				navigation.navigate('DeliverySchedulesFormScreen', { date: day })
				break;
			case 'bt_update':
				doRefresh()
				//getDeliverySchedule({ variables: { carrierServerId: carrierID } })
				break;
		}
	}

	const deleteEvent = () => {
		console.log('eventToDelete >> ', eventToDelete.serverId)
	}

	const reloadApp = () => {
		setLoadingApp(true)
		getDeliverySchedule({ variables: { carrierServerId: carrierID } })
	}

	setTimeout(() => {
		if (loadingApp) setLoadingApp(false)
	}, 2000)

	if (loadingApp) return <Loading />

	return (
		<View style={styles.container}>
			{error ?
				(
					<NetworkError accion={reloadApp} />
				) :
				(
					<>
						{alert}
						<Agenda
							navigation={navigation}
							data={myDeliverySchedule}
							selectedDay={day}
							deleteDay={deleteDay}
							setDay={setDay}
							doRefresh={doRefresh}
							refreshing={refreshing}
						/>
						<FloatingAction
							color={Colors.COLORS.PRIMARY}
							actions={actionsButton}
							onPressItem={name => {
								doAction(name)
							}}
						/>
						{/* <FloatingActionButton icon="calendar" onPress={() => navigation.navigate('DeliverySchedulesFormScreen', {
							date: day
						})} /> */}
						<AwesomeAlert
							show={showAlertAw}
							showProgress={false}
							title={alertTitle}
							message={alertMessage}
							closeOnTouchOutside={false}
							closeOnHardwareBackPress={false}
							showCancelButton={true}
							showConfirmButton={true}
							cancelText="Cancelar"
							confirmText="Eliminar"
							confirmButtonColor="#FB6340"
							onCancelPressed={() => {
								setShowAlert(false)
							}}
							onConfirmPressed={() => {
								deleteEvent()
							}}
						/>
					</>
				)
			}
		</View >
	)
}

const styles = StyleSheet.create({
	headerRight: {
		marginRight: 20,
	},
	container: {
		flex: 1,
	},
})