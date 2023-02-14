import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { useDispatch } from 'react-redux'
import AppIntroSlider from 'react-native-app-intro-slider'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { Typography } from '../../components'
import { onboarding } from '../../constants/mock'
import { setOnboarding } from '../../redux/onboarding/onboardingSlice'

export default function OnboardingScreen({ navigation }) {
	const dispatch = useDispatch()

	navigation.setOptions({
		headerShown: false,
	})

	const renderItem = ({ item }) => {
		return (
			<View
				style={[
					styles.slide,
					{
						backgroundColor: item.bg,
						paddingBottom: 450,
					},
				]}
			>
				<Typography center h1 color="#FFFFFF">
					{item.title}
				</Typography>
				<Image source={item.image} style={styles.image} />
				<Typography center h3 color="#FFFFFF">
					{item.text}
				</Typography>
			</View>
		)
	}

	const keyExtractor = (item) => item.title

	const renderNextButton = () => {
		return (
			<View style={styles.buttonCircle}>
				<FontAwesome
					name="arrow-right"
					color="rgba(255, 255, 255, .9)"
					size={18}
				/>
			</View>
		)
	}

	const onPressDoneButton = () => {
		dispatch(setOnboarding(false))
	}

	const renderDoneButton = () => {
		return (
			<TouchableOpacity
				style={styles.buttonCircle}
				onPress={() => onPressDoneButton()}
			>
				<FontAwesome name="check" color="rgba(255, 255, 255, .9)" size={18} />
			</TouchableOpacity>
		)
	}

	const renderSkipButton = () => {
		return (
			<View style={styles.buttonCircle}>
				<FontAwesome name="check" color="rgba(255, 255, 255, .9)" size={18} />
			</View>
		)
	}

	return (
		<AppIntroSlider
			style={{ flex: 1 }}
			keyExtractor={keyExtractor}
			renderItem={renderItem}
			data={onboarding}
			renderDoneButton={renderDoneButton}
			renderNextButton={renderNextButton}
			renderSkipButton={renderSkipButton}
			showSkipButton
		/>
	)
}

const styles = StyleSheet.create({
	slide: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'blue',
		paddingVertical: 25,
		paddingHorizontal: 28,
	},
	image: {
		width: 320,
		height: 320,
		marginVertical: 32,
	},
	text: {
		color: 'rgba(255, 255, 255, 0.8)',
		textAlign: 'center',
	},
	title: {
		fontSize: 22,
		color: 'white',
		textAlign: 'center',
	},
	buttonCircle: {
		width: 40,
		height: 40,
		backgroundColor: 'rgba(0, 0, 0, .2)',
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
})
