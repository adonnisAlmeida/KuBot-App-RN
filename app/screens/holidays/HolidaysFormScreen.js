import React, { useEffect } from 'react'
import { StyleSheet, View, ToastAndroid, Platform, ActivityIndicator } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { Typography, Button, DatePickerInput, Input } from '../../components'
import { holidays } from '../../constants/mock'
import { addHolyDaysByUser } from '../../redux/holydays/holydaysSlice'
import { CREATE_VACATION } from '../../graphql/holydays'
import { useLazyQuery, useMutation } from '@apollo/client'
import Colors from '../../constants/Colors'
import { CARRIER_INFO } from '../../graphql/login'
import { setCarrierInfo } from '../../redux/userlogin/userLoginSlice'

export default function HolidaysFormScreen({ navigation }) {
	const [description, setDescription] = React.useState('')
	const [from, setFrom] = React.useState('')
	const [to, setTo] = React.useState('')
	const [errors, setErrors] = React.useState([])
	const dispatch = useDispatch()

	const userStore = useSelector(state => state.userlogin)
	const carrierID = userStore.carrierInfo.serverId;

	const [getCarrierInfo, { loadingCI, errorCI, dataCI }] = useLazyQuery(CARRIER_INFO, {
		onCompleted: (dataCI) => {
			dispatch(setCarrierInfo(dataCI.myCarrierInfo))
		},
		onError: (errorCI) => {
			dispatch(setCarrierInfo({}))
			console.log('ERROR GET_CARRIER_BY_USER_EMAIL >> ', JSON.stringify(errorCI, null, 2))
		},
		fetchPolicy: "no-cache",
	})

	const [createVacation, { loading, error, data }] = useMutation(CREATE_VACATION, {
		onCompleted: async (data) => {
			await getCarrierInfo()
			let newHolyDay = {
				node: {
					description: data.vacationCreate.vacation.description,
					startAt: data.vacationCreate.vacation.startAt,
					finishAt: data.vacationCreate.vacation.finishAt,
					id: data.vacationCreate.vacation.id,
					serverId: data.vacationCreate.vacation.serverId
				},
			}
			dispatch(addHolyDaysByUser(newHolyDay))
			if (Platform.OS === 'android')
				ToastAndroid.show('Se adicionaron las vacaciones.', ToastAndroid.LONG)

			handleReset()
			navigation.navigate('Holidays')
		},
		onError: () => {
			if (Platform.OS === 'android')
				ToastAndroid.show('Error creando las vacaciones.', ToastAndroid.LONG)
			console.log('Error creando vacaiones >> ', error)
			console.log('Error creando vacaiones data >> ', data)
		}
	})

	const hasErrors = (key) => errors.includes(key)

	const handleReset = () => {
		setDescription('')
		setFrom('')
		setTo('')
		setErrors([])
	}

	const handleAdd = () => {
		let error_data = []
		if (description.length == 0) error_data.push('description')
		if (!from) error_data.push('from')
		if (!to) error_data.push('to')
		let fromDate = new Date(from)
		let toDate = new Date(to)
		if (fromDate >= toDate) error_data.push('to')

		if (error_data.length > 0) {
			setErrors(error_data)
		} else {
			createVacation({ variables: { description: description, startAt: from, finishAt: to, carrier: carrierID } })
		}
	}

	return (
		<View style={styles.container}>
			<View>
				<Input
					label="Descripción"
					value={description}
					setValue={setDescription}
					error={hasErrors('description')}
				/>
			</View>
			<View>
				<DatePickerInput
					label="Desde"
					value={from}
					setValue={setFrom}
					date={(from == '') ? new Date() : new Date(from)}
					error={hasErrors('from')}
				/>
			</View>
			<View>
				<DatePickerInput
					label="Hasta"
					value={to}
					setValue={setTo}
					date={(to == '') ? new Date() : new Date(to)}
					error={hasErrors('to')}
				/>
			</View>
			<Button
				color={Colors.COLORS.WEB_BUTTON}
				style={{ alignItems: 'center', marginVertical: 16 }}
				onPress={() => handleAdd()}
			>
				{(loading) ? (
					<ActivityIndicator size="small" color="white" />
				) : (
					<Typography color="#ffffff">Adicionar</Typography>
				)}
			</Button>
			<Button
				color={Colors.COLORS.SWITCH_OFF}
				style={{ alignItems: 'center' }}
				onPress={() => handleReset()}
			>
				<Typography color="#000">Limpiar</Typography>
			</Button>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
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