import React from 'react'
import PropTypes from 'prop-types'
import {
	StyleSheet,
	View,
	TouchableWithoutFeedback,
	ImageBackground,
} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useTheme } from '@react-navigation/native'

import Theme from '../../../constants/Theme'
import { Typography } from '../../../components'
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';

export default function ProductItem({ navigation, product }) {
	const { dark, colors } = useTheme()

	const avatar =
		product.images.length > 0
			? {
				uri: product.images[0].url,
			}
			: require('../../../../assets/user_avatar.png')

	return (
		<TouchableWithoutFeedback
			onPress={() => navigation.navigate('Product', { id: product.id })}
		>
			<View style={dark ? styles.cardDark : styles.card}>
				<Image
					style={styles.avatar}
					imageStyle={styles.avatar}
					source={avatar}
					indicator={Progress.Pie}
					indicatorProps={{
						color: colors.PRIMARY,
						borderWidth: 0,
					}}
				/>
				<View style={styles.card_details}>
					<View
						style={{
							flex: 1,
							flexDirection: 'column',
							justifyContent: 'center',
						}}
					>
						<Typography medium style={{ color: colors.ON_SURFACE }}>
							{product.name.length > 30
								? product.name.substring(0, 25) + '...'
								: product.name}
						</Typography>
						<Typography
							style={{ color: colors.ON_SURFACE_VARIANT }}
						>
							{product.description.substring(0, 30)}
							{'...'}
						</Typography>
					</View>
				</View>
				<View style={{ flex: 0.2, justifyContent: 'center' }}>
					<FontAwesome
						name="chevron-right"
						size={16}
						color={colors.ON_SURFACE_VARIANT}
					/>
				</View>
			</View>
		</TouchableWithoutFeedback>
	)
}

ProductItem.propTypes = {
	product: PropTypes.object,
	navigation: PropTypes.object,
}

const styles = StyleSheet.create({
	card: {
		flex: 1,
		flexDirection: 'row',
		borderColor: 'transparent',
		marginHorizontal: 2,
		marginVertical: Theme.SIZES.BASE / 2,
		padding: Theme.SIZES.BASE,
		backgroundColor: Theme.LIGHT.SURFACE,
		shadowOpacity: Theme.SIZES.OPACITY,
		shadowColor: Theme.LIGHT.BACKGROUND,
		elevation: 16,
		borderRadius: Theme.SIZES.RADIUS,
	},
	cardDark: {
		flex: 1,
		flexDirection: 'row',
		borderColor: 'transparent',
		marginHorizontal: 2,
		marginVertical: Theme.SIZES.BASE / 2,
		padding: Theme.SIZES.BASE,
		backgroundColor: Theme.DARK.SURFACE,
		shadowOpacity: Theme.SIZES.OPACITY,
		shadowColor: Theme.DARK.BACKGROUND,
		elevation: 16,
		borderRadius: Theme.SIZES.RADIUS,
	},
	card_details: {
		flex: 2,
		paddingLeft: 20,
		flexDirection: 'column',
		justifyContent: 'space-around',
	},
	left: {
		marginRight: Theme.SIZES.BASE,
	},
	right: {
		width: 10,
		backgroundColor: 'transparent',
	},
	avatar: {
		position: 'relative',
		width: 42,
		height: 42,
		borderRadius: 62,
		borderWidth: 0,
	},
})
