import React from 'react'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import { useTheme } from '@react-navigation/native'

import DateTimePickerModal from 'react-native-modal-datetime-picker'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Typography from './Typography'

import moment from 'moment'
import Colors from '../constants/Colors'
moment.locale('es')

export function TimePickerInput({ label, value, is24 = false, setValue, error, date = null, ...props }) {
	return (
		<DatePickerInput
			label={label}
			value={value}
			setValue={setValue}
			error={error}
			type="time"
			date={date}
			props={props}
			is24={is24}
		/>
	)
}

export function TimePickerInputLineal({ label, is24 = false, value, setValue, error, date = null, ...props }) {
	return (
		<DatePickerInputLineal
			label={label}
			value={value}
			setValue={setValue}
			error={error}
			type="time"
			date={date}
			props={props}
			is24={is24}
		/>
	)
}

export function DatePickerInput({
	label,
	value,
	setValue,
	is24 = false,
	error,
	type = 'date',
	date = null,
	...props
}) {
	const { colors } = useTheme()
	const [showDatePicker, setShowDatePicker] = React.useState(false)

	const onCancel = () => {
		setShowDatePicker(false)
	}

	const onConfirm = (date) => {
		setShowDatePicker(false)
		setValue(moment(date.toString()).format(type == 'date' ? 'YYYY-MM-DD' : 'h:mm a'))
	}

	return (
		<React.Fragment>
			{label && (
				<Typography
					color={colors.ON_SURFACE_VARIANT}
					style={[{ marginVertical: 10 }, error && styles.hasErrorLabel]}
				>
					{label}
				</Typography>
			)}
			<TouchableOpacity onPress={() => setShowDatePicker(true)}>
				<Text
					style={[
						styles.input,
						{ color: colors.ON_BACKGROUND },
						props.style,
						error && styles.hasErrorsInput,
					]}
				>
					{value}
				</Text>
			</TouchableOpacity>
			{type == "time" ? (
				<DateTimePickerModal
					is24Hour={is24}
					locale="en_GB"
					isVisible={showDatePicker}
					mode={type}
					date={date == null ? new Date() : new Date(date)}
					onCancel={onCancel}
					onConfirm={onConfirm}
					//themeVariant='dark'
					positiveButtonLabel='ok'
					style={{
						textColor: '#CF1212',
						accentColor: '#CF1212'
					}}
				//isDarkModeEnabled={true}
				/>
			) : (
				<DateTimePickerModal
					isVisible={showDatePicker}
					mode={type}
					date={date == null ? new Date() : new Date(moment(date).add(1, 'd').format('YYYY-MM-DD'))}
					onCancel={onCancel}
					onConfirm={onConfirm}
					//themeVariant='dark'
					positiveButtonLabel='ok'
					style={{
						textColor: '#CF1212',
						accentColor: '#CF1212'
					}}
				//isDarkModeEnabled={true}
				/>
			)}

		</React.Fragment>
	)
}

export function DatePickerInputLineal({
	label,
	value,
	setValue,
	error,
	type = 'date',
	date = null,
	resetInput = () => console.log("Resetear Input"),
	...props
}) {
	const { colors } = useTheme()
	const [showDatePicker, setShowDatePicker] = React.useState(false)

	const onCancel = () => {
		setShowDatePicker(false)
	}

	const onConfirm = (date) => {
		setShowDatePicker(false)
		setValue(moment(date.toString()).format(type == 'date' ? 'YYYY-MM-DD' : 'h:mm a'))
	}

	return (
		<React.Fragment>
			<TouchableOpacity
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					flex: 1,
					paddingVertical: 10,
				}}
				onPress={() => setShowDatePicker(true)}>
				{label && (
					<Typography
						color={colors.ON_SURFACE_VARIANT}
						style={[error && styles.hasErrorLabel]}
					>
						{label}
					</Typography>
				)}
				<View
					style={[
						//styles.input,
						{
							color: colors.ON_BACKGROUND,
							flexDirection: 'row',
						},
						props.style,
						error && styles.hasErrorsInput,
					]}
				>
					<Typography>
						{value}
					</Typography>

				</View>
			</TouchableOpacity>
			{type != "time" && value ? (
				<TouchableOpacity
					style={{
						paddingLeft: 8,
						paddingTop: 10,
						//backgroundColor: 'blue'
					}}
					onPress={() => resetInput()}
					hitSlop={{ x: 25, y: 15 }}
				>
					<Ionicons
						name={'close-circle'}
						size={20}
						color={Colors.COLORS.WARNING}
					/>
				</TouchableOpacity>
			) : (
				null
			)}
			{type == "time" ? (
				<DateTimePickerModal
					is24Hour={false}
					locale="en_GB"
					isVisible={showDatePicker}
					mode={type}
					date={date == null ? new Date() : new Date(date)}
					onCancel={onCancel}
					onConfirm={onConfirm}
					//themeVariant='dark'
					positiveButtonLabel='ok'
					style={{
						textColor: '#CF1212',
						accentColor: '#CF1212'
					}}
				//isDarkModeEnabled={true}
				/>
			) : (
				<DateTimePickerModal
					isVisible={showDatePicker}
					mode={type}
					date={date == null ? new Date() : new Date(moment(date).add(1, 'd').format('YYYY-MM-DD'))}
					onCancel={onCancel}
					onConfirm={onConfirm}
					//themeVariant='dark'
					positiveButtonLabel='ok'
					style={{
						textColor: '#CF1212',
						accentColor: '#CF1212'
					}}
				//isDarkModeEnabled={true}
				/>
			)}

		</React.Fragment>
	)
}

const styles = StyleSheet.create({
	input: {
		borderRadius: 0,
		borderWidth: 0,
		borderBottomColor: '#8E8E8E',
		borderBottomWidth: StyleSheet.hairlineWidth,
		height: 30,
	},
	hasErrorLabel: {
		color: '#CF6679',
	},
	hasErrorsInput: {
		borderBottomColor: '#CF6679',
	},
})
