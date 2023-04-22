import React from 'react'
import { StyleSheet, Dimensions, View, TouchableOpacity, Text, ActivityIndicator, RefreshControl, FlatList } from 'react-native'
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
import { cyrb53, stringToColour } from '../../../utils/CommonFunctions'
import Colors from '../../../constants/Colors'
moment.locale('es')

const { width } = Dimensions.get('window')

export default function Agenda({ navigation, data, deleteDay, setDay, selectedDay, doRefresh, refreshing }) {
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

	const customRenderList = (param) => {
		//console.log(`RENDER LIST >> `)
		let datos = []
		if (param.items[selectedDay] !== undefined) {
			datos = param.items[selectedDay]
		}
		const splitSelectedDay = selectedDay.split("-");
		const dateSelectDay = new Date(splitSelectedDay[0], splitSelectedDay[1] - 1, splitSelectedDay[2]);

		let weekDay = DAY_NAMES_SHORT[dateSelectDay.getUTCDay()]
		var todaysDate = new Date();
		let isToday = dateSelectDay.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)
		/* console.log("TODAY  ", todaysDate)
		console.log("SELECTED ", dateSelectDay) */
		//param.items[selectedDay]
		//console.log(`RENDER LIST  datos >> ${selectedDay}`, datos)

		//console.log("REFRESHIN DESDE AGENDA ", refreshing)

		return (
			<FlatList
				style={styles.agendaList}
				data={datos}
				refreshControl={
					<RefreshControl
						colors={[Colors.COLORS.PRIMARY]}
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				}
				keyExtractor={item => item.serverId}
				renderItem={({ item, index, separators }) => (
					<View style={{ flexDirection: 'row' }}>
						{index == 0 ? (
							<View style={{ width: 47, marginTop: 25 }}>
								<Typography size={28} color={isToday ? Colors.COLORS.INFO : Colors.COLORS.ACTIVE_DARKMODE} >
									{splitSelectedDay[2]}
								</Typography>
								<Typography style={{ marginLeft: 5, marginTop: -3 }} color={isToday ? Colors.COLORS.INFO : Colors.COLORS.ACTIVE_DARKMODE}>
									{weekDay}
								</Typography>
							</View>

						) : (
							<View style={{ width: 47 }}>
							</View>
						)}
						<TouchableOpacity
							key={index}
							style={[styles.card, { backgroundColor: colors.MODAL }]}
							//onLongPress={() => deleteDay(item)} // voy a manejar el eliminar en la vista editar
							onPress={() => navigation.navigate('DeliverySchedulesFormScreen', {
								event: item,
								date: selectedDay
							})}
						>
							<View style={{
								flexDirection: 'row',
								
								borderRadius: 10,
								borderWidth: 1,
								borderColor: Colors.COLORS.ACTIVE_DARKMODE
							}}>
								<View style={{
									//backgroundColor: stringToColour(item.rule ? item.rule.frequency : 'never'),
									//backgroundColor: stringToColour(item.start + item.end + item.id),
									//backgroundColor: stringToColour(item.id),
									borderTopLeftRadius: 100,
									borderBottomStartRadius: 100,
									width: 8,
									backgroundColor: stringToColour(item.rule ? item.rule.frequency : 'Never') + '99',
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
									{/* <Typography>
										{item.serverId}
									</Typography> */}
								</View>
								{/* <View
									style={{
										position: 'absolute',
										top: 15,
										left: 280,
										height: 15,
										width: 15,
										borderRadius: 100,
										backgroundColor: stringToColour(item.rule ? item.rule.frequency : 'never') + '50'
									}}
								/> */}
							</View>
						</TouchableOpacity>
					</View>
				)}
			/>
		)
	}

	const styles_select = dark ? styles.selectDark : styles.select

	const onRefresh = () => {
		doRefresh()
	}
	//console.log("DATA DE LA AGENDA >> ", data)
	return (
		<Calendars
			//refreshing={true}
			//markingType={'dot'}
			pastScrollRange={12}
			futureScrollRange={12}
			showOnlySelectedDayItems={true}
			//showScrollIndicator={true}
			//showWeekNumbers={true}
			//disabledByDefault={true}
			//displayLoadingIndicator={true}
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
			//onRefresh={() => console.log('refreshing...')}
			/* refreshControl={
				<RefreshControl
					colors={[Colors.COLORS.PRIMARY]}
					refreshing={refreshing}
					onRefresh={onRefresh}
				/>
			}
			loadItemsForMonth={month => {
				console.log('trigger items loading >> month ', month);
			}} */
			rowHasChanged={(r1, r2) => {
				return r1.title !== r2.title
			}}
			onDayPress={day => {
				setDay(day.dateString)
			}}
			onDayChange={day => {
				setDay(day.dateString)
			}}
			/* selected={kk => {
				console.log("<<<>>> KK ", kk)
			}} */
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
			renderList={(param) => customRenderList(param)}
			renderItem={(item, firstItemInDay) => {
				//console.log(`VA A RENDERIZAR ELEMNTOSSS >> ${firstItemInDay} `, item)
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
								backgroundColor: stringToColour(item.rule ? item.rule.frequency + item.id : 'never' + item.id),
								//backgroundColor: stringToColour(item.id),
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
	agendaList: {
		paddingHorizontal: 15,
	},
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
