import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DrawerContentScrollView } from '@react-navigation/drawer'
import { useTheme } from '@react-navigation/native'
import { Image, TouchableOpacity, StyleSheet, View, Text, ImageBackground } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { isDarkMode, setDarkMode } from '../redux/darkmode/darkModeSlice'
import { user } from '../redux/userlogin/userLoginSlice'
import {
	DrawerItem,
	DrawerItemLogout,
	DrawerItemPerfil,
} from '../components/DrawerItem'
import Screens from '../screens/index'
import Colors from '../constants/Colors'

export default function CustomDrawerContent(props) {
	const { colors } = useTheme()
	const dispatch = useDispatch()
	const darkmode = useSelector(isDarkMode)
	const user_state = useSelector(user)

	const screens = Object.keys(Screens)
		.map((key) => (Screens[key].drawer ? Screens[key] : undefined))
		.filter((key) => key != undefined)

	const avatar = user_state.avatar
		? {
			uri: user_state.avatar.url,
		}
		: require('../../assets/user_avatar.png')

	const image = require('../../assets/banner.jpg')

	return (
		<>
			<View style={styles.image_container}>
				<ImageBackground source={image} resizeMode="cover" style={styles.image}>
					<View style={styles.header}>
						<View>
							<TouchableOpacity>
								<Image source={avatar} style={styles.avatar} />
							</TouchableOpacity>
						</View>
						<View style={styles.header_text}>
							<Text style={{ fontSize: 16, color: '#fff' }}>
								{user_state?.firstName || user_state.email?.split('@')[0]}
							</Text>
							<Text style={{ fontSize: 14, color: '#fff' }}>
								{user_state?.lastName || '@' + user_state.email?.split('@')[1]}
							</Text>
						</View>
						{/* <TouchableOpacity
						style={styles.header_dark}
						onPress={() => dispatch(setDarkMode(!darkmode))}
					>
						<FontAwesome
							name={darkmode ? 'sun-o' : 'moon-o'}
							size={20}
							color={colors.ON_SURFACE}
						/>
					</TouchableOpacity> */}
					</View>
				</ImageBackground>
			</View>

			<DrawerContentScrollView
				{...props}
				style={{ paddingTop: 5, paddingLeft: 8, paddingRight: 14, marginBottom: 130, borderBottomWidth: 1, borderTopWidth: 1 }}
			>
				<View style={{ paddingTop: 10, paddingBottom: 20 }}>
					{screens.map((screen, index) => {
						if (screen.drawer && screen.name != 'Profile')
							return (
								<DrawerItem
									title={screen.title}
									icon={screen.icon}
									key={index}
									navigate={screen.name}
									navigation={props.navigation}
									focused={props.state.index === index ? true : false}
								/>
							)
					})}
				</View>
			</DrawerContentScrollView>
			<View style={styles.logout}>
				<DrawerItemPerfil
					title="Perfil"
					icon="user"
					navigation={props.navigation}
					focused={props.state.index === 2 ? true : false}
				/>
				<DrawerItemLogout title="Cerrar sesión" icon="sign-out" />
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	image_container: {
		width: '100%',
		height: 104,
	},
	header: {
		height: 72,
		paddingLeft: 8,
		paddingTop: 20,
		marginVertical: 16,
		paddingHorizontal: 0,
		flexDirection: 'row',
	},
	image: {
		flex: 1,
		justifyContent: 'center',
	},
	header_text: {
		padding: 5,
		marginLeft: 10,
		color: '#fff',
	},
	header_dark: {
		position: 'absolute',
		padding: 15,
		right: -10,
	},
	avatar: {
		height: 53,
		width: 53,
		borderRadius: 100,
		borderWidth: 2,
		borderColor: Colors.COLORS.PRIMARY,
	},
	logout: {
		width: '90%',
		position: 'absolute',
		bottom: 5,
		left: 8,
	},
})
