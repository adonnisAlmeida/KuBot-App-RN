import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { useTheme } from '@react-navigation/native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

export default function FloatingActionButton({
	color,
	icon,
	textColor,
	style,
	onPress,
}) {
	const { colors } = useTheme()

	return (
		<TouchableOpacity
			onPress={onPress}
			style={[
				styles.button,
				{
					backgroundColor: color || colors.primary,
				},
			]}
		>
			<FontAwesome
				name={icon || 'home'}
				size={18}
				color={textColor || colors.SURFACE}
				style={style}
			/>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	button: {
		padding: 20,
		borderRadius: 100,
		elevation: 8,
		position: 'absolute',
		bottom: 27,
		right: 27,
	},
})
