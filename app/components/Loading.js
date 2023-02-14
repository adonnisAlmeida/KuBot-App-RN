import React from 'react'
import { StyleSheet, ActivityIndicator, View } from 'react-native'
import { useTheme } from '@react-navigation/native'

export default function Loading(props) {
	const { colors } = useTheme()

	return (
		<View style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
			<ActivityIndicator size={50} color={colors.PRIMARY} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
})
