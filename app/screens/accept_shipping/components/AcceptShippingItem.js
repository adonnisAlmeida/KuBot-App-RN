import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@react-navigation/native'
import { Typography } from '../../../components'
import Theme from '../../../constants/Theme'
import moment from 'moment'
import { getCurrencySimbol, orderStatusDisplay } from '../../../utils/CommonFunctions'

moment.locale('es')

const AcceptShippingItem = ({
	select_order,
	navigation,
	...props
}) => {
	const { dark, colors } = useTheme()

	return (
		<TouchableOpacity {...props}>
			<View
				style={[dark ? styles.cardDark : styles.card]}
			>
				<View style={styles.card_details}>
					<View
						style={{
							flex: 1,
							flexDirection: 'column',
							justifyContent: 'center',
						}}
					>
						<Typography
							bold
							color={colors.ON_SURFACE}
							style={{ marginBottom: 8 }}
						>
							Orden # {select_order.number}
						</Typography>
						<View>
							<Typography bold>
								Dirección de Envío:
							</Typography>
							<Typography style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
								{select_order.shippingAddress.city +
									', ' + select_order.shippingAddress.countryArea +
									', ' + select_order.shippingAddress.country.country +
									', ' + select_order.shippingAddress.postalCode}
							</Typography>
							<View style={{ flexDirection: 'row' }}>
								<Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
									Distancia (kms):
								</Typography>
								<Typography color={colors.ON_SURFACE}>
									{select_order.getDistance}
								</Typography>
							</View>
							<View style={{ flexDirection: 'row' }}>
								<Typography bold style={{ marginRight: 5 }} color={colors.ON_SURFACE}>
									Costo de envío:
								</Typography>
								<Typography color={colors.ON_SURFACE}>
									{select_order.shippingPrice.gross.amount} {getCurrencySimbol(select_order.shippingPrice.gross.currency)}	
								</Typography>
							</View>
						</View>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	)
}

/* AcceptShippingItem.propTypes = {
	select_order: PropTypes.object,
	navigation: PropTypes.object,
} */

export default AcceptShippingItem

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
		flexDirection: 'column',
		justifyContent: 'space-around',
	},
	select: {
		backgroundColor: '#cccccc',
	},
	selectDark: {
		backgroundColor: '#535353',
	},
})