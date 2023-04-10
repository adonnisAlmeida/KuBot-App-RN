import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import { useTheme } from '@react-navigation/native'

import DateTimePickerModal from 'react-native-modal-datetime-picker'
import Typography from './Typography'

import moment from 'moment'
moment.locale('es')

export function TimePickerInput({ label, value, setValue, error, date = null, ...props }) {
	return (
		<DatePickerInput
			label={label}
			value={value}
			setValue={setValue}
			error={error}
			type="time"
			date={date}
			props={props}
		/>
	)
}

export function TimePickerInputLineal({ label, value, setValue, error, date = null, ...props }) {
	return (
		<DatePickerInputLineal
			label={label}
			value={value}
			setValue={setValue}
			error={error}
			type="time"
			date={date}
			props={props}
		/>
	)
}

export function DatePickerInput({
	label,
	value,
	setValue,
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

export function DatePickerInputLineal({
	label,
	value,
	setValue,
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
			<TouchableOpacity
			style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1, paddingVertical: 10}}
			onPress={() => setShowDatePicker(true)}>
				{label && (
					<Typography
						color={colors.ON_SURFACE_VARIANT}
						style={[error && styles.hasErrorLabel]}
					>
						{label}
					</Typography>
				)}
				<Text
					style={[
						//styles.input,
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
