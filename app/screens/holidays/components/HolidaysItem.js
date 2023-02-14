import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native'
import { useTheme } from '@react-navigation/native'

import Theme from '../../../constants/Theme'
import { Typography } from '../../../components'
import moment from 'moment'
moment.locale('es')

export default function HolidaysItem({
	navigation,
	holiday,
	select,
	...props
}) {
	const { dark, colors } = useTheme()

	const from = moment(holiday.node.startAt).format('YYYY-MM-DD')
	const to = moment(holiday.node.finishAt).format('YYYY-MM-DD')

	const styles_select = dark ? styles.selectDark : styles.select

	return (
		<TouchableWithoutFeedback {...props}>
			<View
				style={[dark ? styles.cardDark : styles.card, select && styles_select]}
			>
				<View style={styles.card_details}>
					<View
						style={{
							flex: 1,
							flexDirection: 'column',
							justifyContent: 'center',
						}}
					>
						<Typography medium color={colors.ON_SURFACE}>
							{holiday.node.description}
						</Typography>
						<View style={{ marginTop: 10 }}>
							<Typography color={colors.ON_SURFACE}>
								<Typography bold color={colors.ON_SURFACE}>
									Inicio:{' '}
								</Typography>
								{from.toString()}
							</Typography>
							<Typography color={colors.ON_SURFACE}>
								<Typography bold color={colors.ON_SURFACE}>
									Fin:{' '}
								</Typography>
								{to.toString()}
							</Typography>
						</View>
					</View>
				</View>
			</View>
		</TouchableWithoutFeedback>
	)
}

HolidaysItem.propTypes = {
	holidays: PropTypes.object,
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
		paddingLeft: 12,
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
