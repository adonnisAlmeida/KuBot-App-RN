import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
//import { LinearGradient } from 'expo-linear-gradient'
import LinearGradient from 'react-native-linear-gradient';

import Colors from '../constants/Colors'

export default function Button({
	style,
	opacity,
	gradient,
	color,
	startColor,
	endColor,
	end,
	start,
	locations,
	shadow,
	children,
	...props
}) {
	const buttonStyles = [
		styles.button,
		shadow && styles.shadow,
		color && styles[color], // predefined styles colors for backgroundColor
		color && !styles[color] && { backgroundColor: color }, // custom backgroundColor
		style,
	]

	if (gradient) {
		return (
			<TouchableOpacity
				style={[buttonStyles, { padding: 0 }]}
				activeOpacity={opacity}
				{...props}
			>
				<LinearGradient
					start={start}
					end={end}
					locations={locations}
					style={buttonStyles}
					colors={[startColor, endColor]}
				>
					{children}
				</LinearGradient>
			</TouchableOpacity>
		)
	}

	return (
		<TouchableOpacity
			style={buttonStyles}
			activeOpacity={opacity || 0.8}
			{...props}
		>
			{children}
		</TouchableOpacity>
	)
}

Button.defaultProps = {
	startColor: '#0AC4BA',
	endColor: '#2BDA8E',
	start: { x: 0, y: 0 },
	end: { x: 1, y: 1 },
	locations: [0.1, 0.9],
	opacity: 0.8,
	color: Colors.COLORS.PRIMARY,
}

const styles = StyleSheet.create({
	button: {
		borderRadius: 6,
		justifyContent: 'center',
		padding: 10,
	},
	shadow: {
		shadowColor: Colors.COLORS.BLACK,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 10,
	},
	primary: { backgroundColor: Colors.COLORS.PRIMARY },
	secondary: { backgroundColor: Colors.COLORS.SECUNDARY },
	error: { backgroundColor: Colors.COLORS.ERROR },
	black: { backgroundColor: Colors.COLORS.BLACK },
	white: { backgroundColor: Colors.COLORS.WHITE },
})
