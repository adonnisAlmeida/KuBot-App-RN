import React from 'react'
import { StyleSheet, TextInput } from 'react-native'
import { useTheme } from '@react-navigation/native'

import Typography from './Typography'

export default function Input({ label, value, setValue, error, ...props }) {
	const { colors } = useTheme()

	return (
		<React.Fragment>
			{label && (
				<Typography
					color={colors.ON_SURFACE_VARIANT}
					style={[{ marginTop: 10 }, error && styles.hasErrorLabel]}
				>
					{label}
				</Typography>
			)}
			<TextInput
				value={value}
				style={[
					styles.input,
					{ color: colors.ON_BACKGROUND },
					props.style,
					error && styles.hasErrorsInput,
				]}
				onChangeText={(text) => setValue(text)}
				{...props}
			/>
		</React.Fragment>
	)
}

const styles = StyleSheet.create({
	input: {
		//backgroundColor: "blue",
		borderRadius: 0,
		borderWidth: 0,
		borderBottomColor: '#8E8E8E',
		borderBottomWidth: StyleSheet.hairlineWidth,
		height: 45,
	},
	hasErrorLabel: {
		color: '#CF6679',
	},
	hasErrorsInput: {
		borderBottomColor: '#CF6679',
	},
})
