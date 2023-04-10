import React, { useState } from 'react'
import {
	StyleSheet,
	ScrollView,
	FlatList,
	TouchableWithoutFeedback,
	View,
	RefreshControl,
} from 'react-native'
import { useTheme } from '@react-navigation/native'

import MessengerOrdersItem from './MessengerOrdersItem'
import { FloatingActionButton, Typography } from '../../../components'
import Colors from '../../../constants/Colors'

export default function MessengerOrdersList({
	navigation,
	messenger_orders_list,
	delete_messenger_orders,
	doRefresh,
	loadMore,
	renderLoader,
	refreshing
}) {
	const [selected, setSelected] = useState([])
	const { colors } = useTheme()

	navigation.setOptions({
		title:
			selected.length > 0
				? `${selected.length} elemento${selected.length == 1 ? '' : 's'}`
				: 'Orden de Mensajero',
	})

	const onLongPressMessengerOrders = (messenger_orders) => {
		if (selected.includes(messenger_orders.id)) {
			const selected_filter = selected.filter(
				(selected_messenger_orders) =>
					selected_messenger_orders != messenger_orders.id
			)
			setSelected(selected_filter)
		} else setSelected([...selected, messenger_orders.id])
	}

	const onPressMessengerOrders = (messenger_orders) => {
		if (selected.length > 0) onLongPressMessengerOrders(messenger_orders)
		else {
			console.log("ID DE LA ORDEN >> ", messenger_orders.id)
			navigation.navigate('MessengerOrdersDetail', {
				messenger_orders_id: messenger_orders.id,
			})
		}
	}

	const onDeleteMessengerOrders = () => {
		delete_messenger_orders(selected)
		setSelected([])
	}

	const onOutPress = () => {
		setSelected([])
	}

	const onRefresh = () => {
		doRefresh()
	}

	const isSelection = (messenger_orders) =>
		selected.includes(messenger_orders.id)

	return (
		<TouchableWithoutFeedback onPress={() => onOutPress()}>
			<View style={{ flex: 1 }}>
				{messenger_orders_list.length === 0 ? (
					<View
						style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
					>
						<Typography color={colors.ON_BACKGROUND}>
							No hay elementos
						</Typography>
					</View>
				) : (
					<View>
						<FlatList
							style={styles.constains}
							onEndReached={loadMore}
							onEndReachedThreshold={0.5}
							ListFooterComponent={renderLoader}
							showsVerticalScrollIndicator={false}
							data={messenger_orders_list}
							refreshControl={
								<RefreshControl
									colors={[Colors.COLORS.PRIMARY]}
									refreshing={refreshing}
									onRefresh={onRefresh}
								/>
							}
							renderItem={({ item, index, separators }) => (
								<MessengerOrdersItem
									onPress={() => onPressMessengerOrders(item)}
									/* onLongPress={() => onLongPressMessengerOrders(item)} */
									messenger_orders={item}
									navigation={navigation}
									key={index}
									select={isSelection(item)}
								/>
							)}
						/>
					</View>
				)}
				{selected.length > 0 && (
					<FloatingActionButton
						color={selected.length > 0 ? colors.ERROR : colors.primary}
						icon={selected.length > 0 ? 'trash' : 'plane'}
						onPress={() => onDeleteMessengerOrders()}
					/>
				)}
			</View>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	constains: {
		/* marginTop: -12,
		margin: 12,
		paddingVertical: 18, */
		paddingHorizontal: 18,
	},
})
