import React from 'react'
import { TouchableOpacity, StyleSheet, View, Image } from 'react-native'
import { useNavigation, useTheme } from '@react-navigation/native'

import { MENU_DARK, MENU_LIGTH } from '../constants/Images'
import { Typography } from '../components'

export default function Header(props) {
	const navigation = useNavigation()
	const { dark, colors } = useTheme()

	const header_text = [styles.header_text, { color: '#fff' }]

	return (
		<View style={styles.header}>
			<View>
				<Typography semibold title style={header_text}>
					{props.children != 'KuBot' ? props.children : ''}
				</Typography>
			</View>
			<TouchableOpacity
				style={styles.icon}
				onPress={() => navigation.openDrawer()}
			>
				<Image
					style={{ width: 16, height: 15 }}
					source={MENU_DARK}
					//source={dark ? MENU_DARK : MENU_LIGTH}
				/>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	header: {
		width: '100%',
		height: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		elevation: 8,
	},
	header_text: {
		fontSize: 18,
		paddingLeft: 52,
	},
	icon: {
		position: 'absolute',
		left: -12,
		padding: 16,
	},
})
