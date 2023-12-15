import React from 'react'
import {
	StyleSheet,
	FlatList,
	View,
	RefreshControl,
} from 'react-native'
import { useTheme } from '@react-navigation/native'

import MessengerOrdersItem from './MessengerOrdersItem'
import { Typography } from '../../../components'
import Colors from '../../../constants/Colors'

export default function MessengerOrdersList({
	navigation,
	messenger_orders_list,
	doRefresh,
	loadMore,
	renderLoader,
	refreshing,
	activeFilters
}) {
	const { colors } = useTheme()

	const onPressMessengerOrders = (messenger_orders) => {
		navigation.navigate('MessengerOrdersDetail', {
			messenger_orders_id: messenger_orders.serverId,
		})
	}

	const onRefresh = () => {
		doRefresh()
	}

	return (
		<View style={{ flex: 1 }}>
			{messenger_orders_list.length === 0 && activeFilters ? (
				<View
					style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
				>
					<Typography bold h3 color={colors.ON_BACKGROUND}>
						No se encontraron pedidos.
					</Typography>
					<Typography color={colors.ON_BACKGROUND}>
						No se han encontrado pedidos para los filtros aplicados.
					</Typography>
				</View>
			) : (
				messenger_orders_list.length === 0 ? (
					<View
						style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
					>
						<Typography bold h3 color={colors.ON_BACKGROUND}>
							No se encontraron pedidos.
						</Typography>
						<Typography color={colors.ON_BACKGROUND}>
							Los pedidos aparecerán aquí después de que los clientes finalicen el proceso de pago.
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
								/>
							)}
						/>
					</View>
				)
			)}
		</View>
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
