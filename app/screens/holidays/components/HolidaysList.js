import React, { useState } from 'react'
import {
	StyleSheet,
	FlatList,
	TouchableWithoutFeedback,
	View,
	RefreshControl,
} from 'react-native'
import { useTheme } from '@react-navigation/native'

import HolidaysItem from './HolidaysItem'
import { FloatingActionButton, Loading, Typography } from '../../../components'
import Colors from '../../../constants/Colors'
import { FloatingAction } from 'react-native-floating-action'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

export default function HolidaysList({
	navigation,
	holidays_list,
	delete_holidays,
	doRefresh,
	loadMore,
	renderLoader,
	refreshingOtro
}) {

	const [selected, setSelected] = useState([])
	const [selectedId, setSelectedId] = useState([])
	const [refreshing, setRefreshing] = useState(false)
	const { colors } = useTheme()

	navigation.setOptions({
		title:
			selected.length > 0
				? `${selected.length} elemento${selected.length == 1 ? '' : 's'}`
				: 'Vacaciones',
	})

	const onLongPressHolidays = (holidays) => {
		if (selected.includes(holidays.node.serverId)) {
			const selected_filter = selected.filter(
				(selected_holidays) => selected_holidays != holidays.node.serverId
			)
			setSelected(selected_filter)
		} else {
			setSelected([...selected, holidays.node.serverId])
		}
	}

	const onPressHolidays = (holidays) => {
		if (selected.length > 0) onLongPressHolidays(holidays)
	}

	const onFloatingActionButton = () => {
		if (selected.length > 0) {
			delete_holidays(selected)
			setSelected([])
		} else navigation.navigate('HolidaysForm')
	}

	const onOutPress = () => {
		setSelected([])
	}

	const isSelection = (holidays) => selected.includes(holidays.node.serverId)

	const onRefresh = () => {
		setRefreshing(true)
		doRefresh()
		setRefreshing(false)
	}

	const actionIcon = (name) => {
		return (
			<FontAwesome
				name={name}
				size={18}
				color={colors.SURFACE}
			/>
		)
	}

	const actionsTrash = [
		{
			text: "Eliminar",
			icon: actionIcon('trash'),
			name: "bt_trash",
			position: 2,
			color: Colors.COLORS.PRIMARY
		}
	];

	const actionsButton = [
		{
			text: "Actualizar",
			icon: actionIcon('refresh'),
			name: "bt_update",
			position: 2,
			color: Colors.COLORS.PRIMARY
		},
		{
			text: "Agregar Vacaciones",
			icon: actionIcon('plane'),
			name: "bt_add_holyday",
			position: 1,
			color: Colors.COLORS.PRIMARY
		}
	];

	const doAction = (action) => {
		switch (action) {
			case 'bt_add_holyday':
				navigation.navigate('HolidaysForm')
				break;
			case 'bt_update':
				onRefresh()
				break;
			case 'bt_trash':
				onFloatingActionButton()
				break;
		}
	}

	/* React.useEffect(() => {
		console.log({ selected })
	}, [selected]) */

	return (
		<TouchableWithoutFeedback onPress={() => onOutPress()}>
			<View style={{ flex: 1 }}>
				{holidays_list.length === 0 ? (
					<View
						style={{
							flex: 1,
							alignItems: 'center',
							justifyContent: 'center',
							padding: 15,
						}}
					>
						<Typography bold h3 color={colors.ON_BACKGROUND}>
							No se encontraron vacaciones.
						</Typography>
						<Typography color={colors.ON_BACKGROUND}>
							Las vacaciones se utilizan para poner su servicio en vacaciones.
						</Typography>
					</View>
				) : (
					<View>
						<FlatList
							style={styles.constains}
							//showsVerticalScrollIndicator={false}
							onEndReached={loadMore}
							onEndReachedThreshold={0.5}
							refreshControl={
								<RefreshControl
									colors={[Colors.COLORS.PRIMARY]}
									refreshing={refreshingOtro}
									onRefresh={onRefresh}
								/>
							}
							ListFooterComponent={renderLoader}
							data={holidays_list}
							keyExtractor={(item, index) => index.toString()}
							renderItem={({ item, index, separators }) => (
								<HolidaysItem
									onPress={() => onPressHolidays(item)}
									onLongPress={() => onLongPressHolidays(item)}
									holiday={item}
									navigation={navigation}
									key={index}
									select={isSelection(item)}
								/>
							)}
						/>
					</View>
				)}
				{selected.length > 0 ? (
					<FloatingAction
						color={colors.ERROR}
						floatingIcon={actionIcon('trash')}
						overrideWithAction={true}
						actions={actionsTrash}
						onPressItem={name => {
							doAction(name)
						}}
					/>
				) : (
					<FloatingAction
						color={Colors.COLORS.PRIMARY}
						actions={actionsButton}
						onPressItem={name => {
							doAction(name)
						}}
					/>
				)}

				{/* <FloatingActionButton
					color={selected.length > 0 ? colors.ERROR : colors.primary}
					icon={selected.length > 0 ? 'trash' : 'plane'}
					onPress={() => onFloatingActionButton()}
				/> */}
			</View>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	constains: {
		/* marginTop: -12,
		margin: 12,
		paddingVertical: 18, */
		height: '100%',
		paddingHorizontal: 18,
	},
})
