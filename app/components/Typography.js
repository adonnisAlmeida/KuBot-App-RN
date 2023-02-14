import React from 'react'
import { Text, StyleSheet } from 'react-native'

import Theme from '../constants/Theme'
import Colors from '../constants/Colors'

export default function Typography({
	h1,
	h2,
	h3,
	title,
	body,
	caption,
	small,
	size,
	transform,
	regular,
	bold,
	semibold,
	medium,
	weight,
	light,
	center,
	right,
	spacing,
	height,
	color,
	error,
	primary,
	secondary,
	black,
	white,
	style,
	children,
	...props
}) {
	const textStyles = [
		styles.text,
		h1 && styles.h1,
		h2 && styles.h2,
		h3 && styles.h3,
		title && styles.title,
		body && styles.body,
		caption && styles.caption,
		small && styles.small,
		size && { fontSize: size },
		transform && { textTransform: transform },
		height && { lineHeight: height },
		spacing && { letterSpacing: spacing },
		weight && { fontWeight: weight },
		regular && styles.regular,
		bold && styles.bold,
		semibold && styles.semibold,
		medium && styles.medium,
		light && styles.light,
		center && styles.center,
		right && styles.right,
		color && styles[color],
		color && !styles[color] && { color },
		primary && styles.primary,
		secondary && styles.secondary,
		error && styles.error,
		black && styles.black,
		white && styles.white,
		style,
	]

	return (
		<Text style={textStyles} {...props}>
			{children}
		</Text>
	)
}

const styles = StyleSheet.create({
	// default style
	text: {
		//fontFamily: "Rubik-Regular",
		//fontSize: Theme.SIZES.FONT,
		color: Colors.COLORS.BLACK,
	},
	// variations
	regular: {
		fontWeight: 'normal',
		//fontFamily: "Rubik-Regular",
	},
	bold: {
		fontWeight: 'bold',
		//fontFamily: "Rubik-Bold",
	},
	semibold: {
		fontWeight: '500',
		//fontFamily: "Rubik-SemiBold",
	},
	medium: {
		fontWeight: '500',
		//fontFamily: "Rubik-Medium",
	},
	light: {
		fontWeight: '200',
		//fontFamily: "Rubik-Light",
	},
	// position
	center: { textAlign: 'center' },
	right: { textAlign: 'right' },
	left: { textAlign: 'left' },
	// colors
	primary: { color: Colors.COLORS.PRIMARY },
	secondary: { color: Colors.COLORS.SECUNDARY },
	black: { color: Colors.COLORS.BLACK },
	white: { color: Colors.COLORS.WHITE },
	error: { color: Colors.COLORS.ERROR },
	// fonts
	h1: Theme.FONTS.h1,
	h2: Theme.FONTS.h2,
	h3: Theme.FONTS.h3,
	title: Theme.FONTS.title,
	body: Theme.FONTS.body,
	caption: Theme.FONTS.caption,
	small: Theme.FONTS.small,
})
