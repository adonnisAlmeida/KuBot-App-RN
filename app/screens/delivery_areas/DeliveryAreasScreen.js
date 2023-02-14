import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native'
import { useTheme } from '@react-navigation/native'

import { FloatingActionButton, Loading, NetworkError, Typography } from '../../components'
import Theme from '../../constants/Theme'
import { setDeliveryAreasIds, getDeliveryAreasIds, setDeliveryAreas, setDeliveryAreasLoading } from '../../redux/deliveryareas/deliveryareasSlice'
import { provincias } from '../../constants/mock'
import { stringToColour } from '../../utils/CommonFunctions'
import { DELIVERY_ZONES } from '../../graphql/deliveryAreas'
import { useLazyQuery } from '@apollo/client'
import Colors from '../../constants/Colors'

export default function DeliveryAreasScreen({ navigation }) {
	const [myDeliveryAreas, setMyDeliveryAreas] = useState([])
	const [loading, setLoading] = useState(true)
	const [refreshing, setRefreshing] = useState(false)
	const dispatch = useDispatch()
	const { dark, colors } = useTheme()
	const deliveryAreasStore = useSelector(store => store.deliveryareas)
	const userStore = useSelector(state => state.userlogin)
	const carrierID = userStore.carrierInfo.serverId;


	const [getMyDeliveryZones, { loadingZones, error, data }] = useLazyQuery(DELIVERY_ZONES, {
		onCompleted: (data) => {
			let allZones = data.deliveryZones.edges
			let allIds = []
			//console.log('OnCOmplete OK >>>>', data.deliveryZones.edges)
			allZones.map((prov, index) => {
				allIds.push(prov.node.id)
			})
			dispatch(setDeliveryAreas(allZones))
			dispatch(setDeliveryAreasIds(allIds))
			setLoading(false)
			setRefreshing(false)
		},
		onError: () => {
			setLoading(false)
			console.log('Error cargando mis zonas de entrega', error)
			setRefreshing(false)
		},
		fetchPolicy: "no-cache"
	})

	useEffect(() => {
		//initDatosPrueba()
		getMyDeliveryZones({ variables: { after: '', before: '', carrier: carrierID } })
		setLoading(false)
	}, [])

	useEffect(() => {
		setMyDeliveryAreas(deliveryAreasStore.listado)
	}, [deliveryAreasStore.listado])

	/* useEffect(() => {
		let currents = provincias.filter((prov) => {
			if (deliveryAreasStore.ids.includes(prov.node.id)) {
				return prov
			}
		})
		dispatch(setDeliveryAreas(currents))
	}, [deliveryAreasStore.ids]) */

	const reloadApp = () => {
		setLoading(true)
		getMyDeliveryZones({ variables: { after: '', before: '', carrier: carrierID } })
	}

	const onRefresh = () => {
		setRefreshing(true)
		getMyDeliveryZones({ variables: { after: '', before: '', carrier: carrierID } })
		setRefreshing(false)
	}

	if (loading || loadingZones) return <Loading />

	return (
		<View style={{ flex: 1 }}>
			{error ?
				(
					<NetworkError accion={reloadApp} />
				) :
				<>
					<View style={{ flex: 1, marginHorizontal: 16 }}>
						{myDeliveryAreas.length === 0 ? (
							<View
								style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
							>
								<Typography color={colors.ON_BACKGROUND}>
									No hay zonas de entrega
								</Typography>
							</View>
						) : (
							<View style={styles.constains}>
								<FlatList
									showsVerticalScrollIndicator={false}
									data={myDeliveryAreas}
									refreshControl={
										<RefreshControl
											colors={[Colors.COLORS.PRIMARY]}
											refreshing={refreshing}
											onRefresh={onRefresh}
										/>
									}
									keyExtractor={(item, index) => index.toString()}
									renderItem={({ item, index, separators }) => (
										<View style={[dark ? styles.cardDark : styles.card]}>
											<View style={styles.card_details}>
												<View
													style={{
														flex: 1,
														flexDirection: 'column',
														justifyContent: 'center',
													}}
												>
													<Typography bold color={colors.ON_SURFACE}>
														{item.node.parent && item.node.parent.name}
													</Typography>
													<Typography color={colors.ON_SURFACE}>
														{item.node.name}
													</Typography>
												</View>
											</View>
										</View>
									)}
								/>
							</View>
						)}
					</View>
					<FloatingActionButton
						icon={'edit'}
						onPress={() => {
							navigation.navigate('DeliveryAreasForm')
						}}
					/>
				</>
			}
		</View>
	)
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
		shadowColor: Theme.DARK.BACKGROUND,
		elevation: 1,
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
		elevation: 1,
		borderRadius: Theme.SIZES.RADIUS,
	},
	card_details: {
		flexDirection: 'column',
		justifyContent: 'space-around',
	},
})
