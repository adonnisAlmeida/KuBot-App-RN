import React from 'react'
import { useDispatch } from 'react-redux'
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useTheme } from '@react-navigation/native'

import { logout } from '../redux/userlogin/userLoginSlice'
import Theme from '../constants/Theme'
import Colors from '../constants/Colors'

export function DrawerItem(props) {
	const { title, icon, navigate, focused, navigation } = props
	const { dark } = useTheme()

	const containerStyles = [
		styles.defaultStyle,
		focused
			? !dark
				? [styles.activeStyle, styles.shadow]
				: [styles.activeStyle, styles.shadow]
			: null,
	]

	return (
		<TouchableOpacity
			style={styles.constains}
			onPress={() => {
				navigation.closeDrawer()
				navigation.navigate(navigate)
			}}
		>
			<View style={containerStyles}>
				<View style={{ left: 0 }}>
					<FontAwesome
						name={icon}
						size={20}
						color={
							focused
								? Colors.COLORS.WHITE
								: dark
								? Colors.COLORS.WHITE
								: Colors.COLORS.BLACK
						}
					/>
				</View>
				<View style={{ left: 20 }}>
					<Text
						size={16}
						style={{
							color: focused
								? Colors.COLORS.WHITE
								: dark
								? Colors.COLORS.WHITE
								: Colors.COLORS.BLACK,
							fontWeight: focused ? 'bold' : 'normal',
						}}
					>
						{title}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

export function DrawerItemLogout(props) {
	const { title, icon } = props
	const { dark } = useTheme()
	const dispatch = useDispatch()

	const containerStyles = [styles.defaultStyle]

	return (
		<TouchableOpacity
			style={styles.constains}
			onPress={() => dispatch(logout())}
		>
			<View style={containerStyles}>
				<View style={{ left: 0 }}>
					<FontAwesome
						name={icon}
						size={20}
						color={dark ? Colors.COLORS.WHITE : Colors.COLORS.BLACK}
					/>
				</View>
				<View style={{ left: 20 }}>
					<Text
						size={16}
						style={{
							color: dark ? Colors.COLORS.WHITE : Colors.COLORS.BLACK,
							fontWeight: 'normal',
						}}
					>
						{title}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

export function DrawerItemPerfil(props) {
	const { title, icon, navigation, focused } = props
	const { dark } = useTheme()

	const containerStyles = [
		styles.defaultStyle,
		focused
			? !dark
				? [styles.activeStyle, styles.shadow]
				: [styles.activeStyle, styles.shadow]
			: null,
	]

	return (
		<TouchableOpacity
			style={styles.constains}
			onPress={() => {
				navigation.closeDrawer()
				navigation.navigate('Profile')
			}}
		>
			<View style={containerStyles}>
				<View style={{ left: 0 }}>
					<FontAwesome
						name={icon}
						size={20}
						color={
							focused
								? Colors.COLORS.WHITE
								: dark
								? Colors.COLORS.WHITE
								: Colors.COLORS.BLACK
						}
					/>
				</View>
				<View style={{ left: 20 }}>
					<Text
						size={16}
						style={{
							color: focused
								? Colors.COLORS.WHITE
								: dark
								? Colors.COLORS.WHITE
								: Colors.COLORS.BLACK,
							fontWeight: focused ? 'bold' : 'normal',
						}}
					>
						{title}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	constains: {
		height: 60,
	},
	defaultStyle: {
		flex: 1,
		flexDirection: 'row',
		paddingVertical: 18,
		paddingHorizontal: 16,
	},
	activeStyle: {
		backgroundColor: Theme.LIGHT.PRIMARY,
		borderRadius: 10,
	},
	activeStyleDark: {
		backgroundColor: Colors.COLORS.ACTIVE_DARKMODE,
		borderRadius: 10,
	},
	shadow: {
		elevation: 8,
		shadowColor: Colors.COLORS.BLACK,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowRadius: 8,
		shadowOpacity: 0.1,
	},
	label: {
		backgroundColor: Colors.COLORS.LABEL,
		paddingHorizontal: 6,
		marginLeft: 10,
		borderRadius: 6,
		height: 16,
		width: 36,
	},
})

/*
<View middle style={styles.label}>
  <Text size={12} color={Colors.COLORS.WHITE}>
    PRO
  </Text>
</View>
*/
