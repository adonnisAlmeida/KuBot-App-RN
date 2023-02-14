import React from 'react'
import { StyleSheet, Dimensions, View, TouchableOpacity, Text } from 'react-native'
import { useTheme } from '@react-navigation/native'
import { Agenda as Calendars, LocaleConfig } from 'react-native-calendars'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { Typography } from '../../../components'
import {
	MONTH_NAMES,
	MONTH_NAMES_SHORT,
	DAY_NAMES,
	DAY_NAMES_SHORT,
} from '../../../constants/Other'
import Theme from '../../../constants/Theme'
import moment from 'moment'
import { stringToColour } from '../../../utils/CommonFunctions'
import Colors from '../../../constants/Colors'
moment.locale('es')

const { width } = Dimensions.get('window')

export default function Agenda({ navigation, data, deleteDay, setDay, selectedDay }) {
	const [selected, setSelected] = React.useState([])
	const [calendarData, setCalendarData] = React.useState(data)
	const [localDay, setLocalDay] = React.useState(selectedDay)
	const { dark, colors } = useTheme()

	LocaleConfig.locales['es'] = {
		monthNames: MONTH_NAMES,
		monthNamesShort: MONTH_NAMES_SHORT,
		dayNames: DAY_NAMES,
		dayNamesShort: DAY_NAMES_SHORT,
		today: 'Hoy',
	}

	LocaleConfig.defaultLocale = 'es'

	const startEndShow = (start, end) => {
		const startFromated = moment(start).format("hh:mm a")
		const endFromated = moment(end).format("hh:mm a")
		return (`${startFromated} - ${endFromated}`)
	}

	const styles_select = dark ? styles.selectDark : styles.select

	return (
		<Calendars
			refreshing={true}
			pastScrollRange={12}
			futureScrollRange={12}
			showOnlySelectedDayItems={true}
			items={data}
			renderKnob={() => {
				return (
					<FontAwesome
						name={'chevron-down'}
						size={20}
						color={Colors.COLORS.PRIMARY}
					/>
				)
			}}
			rowHasChanged={(r1, r2) => {
				return r1.title !== r2.title
			}}
			onDayPress={day => {
				setDay(day.dateString)
			}}
			renderEmptyData={() => {
				return (
					<View
						style={{
							flex: 1,
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Typography h2 color={colors.ON_BACKGROUND}>
							No hay datos disponibles
						</Typography>
					</View>
				)
			}}
			renderItem={(item, firstItemInDay) => {
				return (
					<TouchableOpacity
						style={[styles.card, { backgroundColor: colors.MODAL }]}
						//onLongPress={() => deleteDay(item)} // voy a manejar el eliminar en la vista editar
						onPress={() => navigation.navigate('DeliverySchedulesFormScreen', {
							event: item,
							date: selectedDay
						})}
					>
						<View style={{ flexDirection: 'row' }}>
							<View style={{
								backgroundColor: stringToColour(item.rule ? item.rule.frequency : 'never'),
								borderTopLeftRadius: Theme.SIZES.RADIUS,
								borderBottomStartRadius: Theme.SIZES.RADIUS,
								width: 5
							}}>
							</View>
							<View style={{ padding: Theme.SIZES.BASE }}>
								{/* <Typography style={{ marginBottom: 3 }} bold regular color={colors.ON_MODAL}>
									{item.title}
								</Typography>
								<Typography style={{ marginBottom: 3 }} regular color={colors.ON_MODAL}>
									{item.description}
								</Typography> */}
								<Typography regular color={colors.ON_MODAL}>
									{startEndShow(item.start, item.end)}
								</Typography>
								<Typography>
									{item.serverId}
								</Typography>
							</View>

						</View>

					</TouchableOpacity>
				)
			}}
			theme={{
				agendaKnobColor: colors.PRIMARY,
				backgroundColor: colors.BACKGROUND,
				calendarBackground: colors.BACKGROUND,
				selectedDayBackgroundColor: colors.PRIMARY,
				todayTextColor: colors.PRIMARY,
				dotColor: colors.PRIMARY,
				selectedDotColor: '#ffffff',
			}}
		/>
	)
}

const styles = StyleSheet.create({
	card: {
		width: width - 80,
		borderColor: 'transparent',
		borderRadius: Theme.SIZES.RADIUS,
		marginTop: 20,
		marginBottom: 10,
		//padding: Theme.SIZES.BASE,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 1.5 },
		shadowRadius: Theme.SIZES.RADIUS,
	},
	select: {
		backgroundColor: '#cccccc',
	},
	selectDark: {
		backgroundColor: '#535353',
	},
})
