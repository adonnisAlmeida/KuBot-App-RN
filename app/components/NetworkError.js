import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { useTheme } from '@react-navigation/native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { Button, Typography } from './'

export default function NetworkError({ accion, mTop }) {
	const { dark, colors } = useTheme()

	const cicle_color = dark ? '#0062DA1F' : '#0062DA1F'

	return (
		<View style={[styles.container, {marginTop: mTop? mTop: -80}]}>
			<View
				style={[
					styles.cicle,
					{ backgroundColor: cicle_color, height: 200, width: 200, margin: 0 },
				]}
			>
				<View style={[styles.cicle, { backgroundColor: cicle_color }]}>
					<FontAwesome
						color={colors.ON_BACKGROUND}
						style={{ padding: 38 }}
						name="signal"
						size={72}
					/>
				</View>
			</View>
			<Typography center color={colors.ON_BACKGROUND} style={{ margin: 20 }}>
				Ha habido un problema en la conexión, actualice la aplicación.
			</Typography>
			<Button color={colors.primary} onPress={() => accion()}>
				<Text style={{ color: '#fff' }}>Actualizar</Text>
			</Button>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginHorizontal: 20,
		//marginTop:-80,
		justifyContent: 'center',
		alignItems: 'center',
	},
	cicle: {
		position: 'relative',
		height: 150,
		width: 150,
		borderRadius: 100,
		alignItems: 'center',
		alignContent: 'center',
		margin: 26,
	},
})
