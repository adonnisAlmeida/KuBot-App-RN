import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme } from '@react-navigation/native'
import { Picker } from '@react-native-picker/picker'
import Typography from './Typography'

export default function Select({ label, items, value, setValue, error, ...props }) {
	const { colors } = useTheme()

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
			<Picker
				themeVariant={'dark'}
				selectedValue={value}
				style={[
					styles.select,
					{ color: colors.ON_BACKGROUND },
					props.style,
					error && styles.hasErrorsInput,
				]}
				onValueChange={(itemValue, itemIndex) => {
					setValue(itemValue)
				}
				}>
				{
					items.map((item, index) => {
						return <Picker.Item key={index} themeVariant={'dark'} label={item.nameSpanish} value={item.serverId} />
					})
				}
			</Picker>
			<View style={styles.underline} />
		</React.Fragment>
	)
}

const styles = StyleSheet.create({
	underline: {
		borderBottomColor: '#8E8E8E',
		borderBottomWidth: StyleSheet.hairlineWidth,
		marginBottom: 8,
		padding: -10
	},
	select: {
		borderRadius: 0,
		borderWidth: 0,
		marginTop: -15,
		marginLeft: -15,
		marginBottom: -6
	},
	hasErrorLabel: {
		color: '#CF6679',
	},
	hasErrorsInput: {
		borderBottomColor: '#CF6679',
	},
})
