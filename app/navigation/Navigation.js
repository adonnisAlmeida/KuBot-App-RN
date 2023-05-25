import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useSelector, useDispatch } from 'react-redux'
import { StatusBar, Text, View } from 'react-native'

import Theme from '../constants/Theme'
import { isLogin, getUser, getCarrierInfo, user } from '../redux/userlogin/userLoginSlice'
import { isDarkMode } from '../redux/darkmode/darkModeSlice'
import { active, getOnboarding } from '../redux/onboarding/onboardingSlice'
import Screens from '../screens/index'
import Header from './Header'
import CustomDrawerContent from './CustomDrawerContent'
import Colors from '../constants/Colors'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

const screens = Object.keys(Screens).map((key) => Screens[key])

function DrawerNavigator(props) {
	const user_state = useSelector(user)
	return (
		<Drawer.Navigator
			screenOptions={{
				headerStyle: {
					backgroundColor: Colors.COLORS.PRIMARY,
				},
				headerTintColor: '#fff',
			}}
			style={{ flex: 1 }}
			drawerContent={(props) => <CustomDrawerContent {...props} />}
		>
			{screens.map((screen, index) => {
				if (screen.drawer === true) {
					if (user_state.isCarrier) {
						return (
							<Drawer.Screen
								key={index}
								name={screen.name}
								component={screen.component}
								options={{
									title: screen.title,
									headerShown: true,
									headerTitle: (props) => <Header {...props} />,
									headerLeft: false
								}}
							/>
						)
					} else if (!screen.carrier_only) {
						return (
							<Drawer.Screen
								key={index}
								name={screen.name}
								component={screen.component}
								options={{
									title: screen.title,
									headerShown: true,
									headerTitle: (props) => <Header {...props} />,
									headerLeft: false
								}}
							/>
						)
					}
				}
			})}
		</Drawer.Navigator>
	)
}

export default function Navigation(props) {
	const dispatch = useDispatch()
	const darkmode = useSelector(isDarkMode)
	const isLoginActive = useSelector(isLogin)

	React.useEffect(() => {
		if (!isLoginActive) {
			dispatch(getUser())
			dispatch(getCarrierInfo())
		}
	}, [])

	return (
		<>
			<StatusBar
				backgroundColor={
					Colors.COLORS.PRIMARY
				}
				barStyle={'light-content'}
			/>
			{/* <StatusBar
				backgroundColor={
					!darkmode ? Theme.LIGHT.BACKGROUND : Theme.DARK.BACKGROUND
				}
				barStyle={!darkmode ? 'dark-content' : 'light-content'}
			/> */}
			{isLoginActive ? <AppNavigation /> : <LoginNavigation />}
		</>
	)
}

function AppNavigation(props) {
	const darkmode = useSelector(isDarkMode)
	const user_state = useSelector(user)

	return (
		<NavigationContainer theme={darkmode ? Theme.ThemeDark : Theme.ThemeLight}>
			<Stack.Navigator
				initialRouteName="DrawerNavigator"
				screenOptions={{
					headerStyle: {
						backgroundColor: Colors.COLORS.PRIMARY,
					},
					headerTintColor: '#fff',
				}}>
				<Stack.Screen
					name="DrawerNavigator"
					component={DrawerNavigator}
					options={{ headerShown: false }}
				/>
				{screens.map((screen, index) => {
					if (screen.drawer === false) {
						if (user_state.isCarrier) {
							return (
								<Stack.Screen
									key={index}
									name={screen.name}
									component={screen.component}
									options={{
										title: screen.title,
									}}
								/>
							)
						} else if (!screen.carrier_only) {
							return (
								<Stack.Screen
									key={index}
									name={screen.name}
									component={screen.component}
									options={{
										title: screen.title,
									}}
								/>
							)
						}
					}
				})}
			</Stack.Navigator>
		</NavigationContainer>
	)
}

function LoginNavigation(props) {
	const dispatch = useDispatch()
	const darkmode = useSelector(isDarkMode)
	const onboarding_active = useSelector(active)

	React.useEffect(() => {
		dispatch(getOnboarding())
	}, [])

	return (
		<NavigationContainer theme={darkmode ? Theme.ThemeDark : Theme.ThemeLight}>
			<Stack.Navigator
				initialRouteName="DrawerNavigator"
				screenOptions={{
					headerStyle: {
						backgroundColor: '#f4511e',
					},
					headerTintColor: '#fff',
					headerTitleStyle: {
						fontWeight: 'bold',
					},
				}}
			>
				{onboarding_active && (
					<Stack.Screen
						name={Screens.ONBOARDING.name}
						component={Screens.ONBOARDING.component}
						options={{
							headerShown: false,
						}}
					/>
				)}
				<Stack.Screen
					name={Screens.LOGIN.name}
					component={Screens.LOGIN.component}
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name={Screens.REGISTER.name}
					component={Screens.REGISTER.component}
					options={{
						headerShown: false,
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	)
}
