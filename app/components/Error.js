import React from 'react'
import { StyleSheet, ImageBackground, View, Button } from 'react-native'
import { useTheme } from '@react-navigation/native'

export default function Error(props) {
	const { colors } = useTheme()

	return (
		<View style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
			<Button color={colors.PRIMARY} title="Cargar" onPress={props.action} />
			<ImageBackground
				source={require('../../assets/page404.png')}
				style={{ width: '100%', height: '100%' }}
			/>
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
