import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, TouchableWithoutFeedback, Image, Text, TouchableOpacity } from 'react-native'
import { useTheme } from '@react-navigation/native'
import moment from 'moment'

import Theme from '../../../constants/Theme'
import { Typography } from '../../../components'
import Colors from '../../../constants/Colors'
import { orderShippingStatusDisplay, orderStatusDisplay, stringToColour } from '../../../utils/CommonFunctions'

moment.locale('es')

export default function MessengerOrdersItem({
	navigation,
	messenger_orders,
	...props
}) {
	const { dark, colors } = useTheme()

	const colorBonito = (estado) => {
		switch (estado) {
			case 'NO_STATUS':
				return Colors.ORDER_STATUS.NO_STATUS
			case 'ACCEPTED_CARRIER':
				return Colors.ORDER_STATUS.ACCEPTED_CARRIER
			case 'PICKED_UP_CARRIER':
				return Colors.ORDER_STATUS.PICKED_UP_CARRIER
			case 'IN_TRANSIT':
				return Colors.ORDER_STATUS.IN_TRANSIT
			case 'DELIVERED':
				return Colors.ORDER_STATUS.DELIVERED
			case 'REJECTED':
				return Colors.ORDER_STATUS.REJECTED
			case 'LOST':
				return Colors.ORDER_STATUS.LOST

			default:
				return Colors.ORDER_STATUS.NO_STATUS
		}
	}

	return (
		<TouchableOpacity {...props}>
			<View style={[dark ? styles.cardDark : styles.card]}>
				<View style={styles.allInfo}>
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
								{messenger_orders.user
									? (
										messenger_orders.user.firstName? (
											messenger_orders.user.firstName + ' ' + messenger_orders.user.lastName
										): (
											messenger_orders.user.userName
										)
									)
									: 'Invitado'}
							</Typography>
							<Typography
								bold
								color={colors.ON_SURFACE}
							>
								Orden # {messenger_orders.number}
							</Typography>
							<Typography color={colors.ON_SURFACE}>
								<Typography bold color={colors.ON_SURFACE}>
									Fecha:
								</Typography>{' '}
								{moment(messenger_orders.created).format('YYYY-MM-DD')}
							</Typography>
							{/* <Typography color={colors.ON_SURFACE}>
								<Typography bold color={colors.ON_SURFACE}>
									Estado:
								</Typography>{' '}
								{orderStatusDisplay(messenger_orders.status).toUpperCase()}
							</Typography> */}
							<Typography color={colors.ON_SURFACE}>
								<Typography bold color={colors.ON_SURFACE}>
									Estado de Envío:
								</Typography>{' '}
								{orderShippingStatusDisplay(messenger_orders.shippingStatus).toUpperCase()}
							</Typography>
							{/* <Typography color={colors.ON_SURFACE}>
								<Typography bold color={colors.ON_SURFACE}>
									Dirección:
								</Typography>{' '}
								{messenger_orders.shippingAddress?.streetAddress1}
							</Typography> */}
						</View>
					</View>
				</View>
				<View style={[styles.rightLine, { backgroundColor: colorBonito(messenger_orders.shippingStatus) }]}>
				</View>
			</View>
		</TouchableOpacity>
	)
}

MessengerOrdersItem.propTypes = {
	messenger_orders: PropTypes.object,
	navigation: PropTypes.object,
}

const styles = StyleSheet.create({
	rightLine: {
		borderTopRightRadius: Theme.SIZES.RADIUS,
		borderBottomEndRadius: Theme.SIZES.RADIUS,
		width: 10
	},
	allInfo: {
		padding: Theme.SIZES.BASE,
		marginRight: -40,
	},
	card: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderColor: 'transparent',
		marginHorizontal: 2,
		marginVertical: Theme.SIZES.BASE / 2,
		//padding: Theme.SIZES.BASE,
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
		justifyContent: 'space-between',
		marginHorizontal: 2,
		marginVertical: Theme.SIZES.BASE / 2,
		//padding: Theme.SIZES.BASE,
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
	selectDark: {
		backgroundColor: '#535353',
	},
})
