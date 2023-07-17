import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native'
import { useTheme } from '@react-navigation/native'
import { FloatingAction } from 'react-native-floating-action'

import { FloatingActionButton, Loading, NetworkError, Typography } from '../../components'
import Theme from '../../constants/Theme'
import { setDeliveryAreas, listado } from '../../redux/deliveryareas/deliveryareasSlice'
import { DELIVERY_ZONES } from '../../graphql/deliveryAreas'
import { useLazyQuery } from '@apollo/client'
import Colors from '../../constants/Colors'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default function DeliveryAreasScreen({ navigation }) {
	const [myDeliveryAreas, setMyDeliveryAreas] = useState([])
	const [reLoading, setReLoading] = useState(false)
	const [loading, setLoading] = useState(false)
	const [refreshing, setRefreshing] = useState(false)
	const dispatch = useDispatch()
	const { dark, colors } = useTheme()
	const deliveryAreasStore = useSelector(listado)
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
			setMyDeliveryAreas(allZones)
			//dispatch(setDeliveryAreasIds(allIds))
			setReLoading(false)
			setLoading(false)
			setRefreshing(false)
		},
		onError: () => {
			setReLoading(false)
			setLoading(false)
			console.log('Error cargando mis zonas de entrega', error)
			setRefreshing(false)
		},
		fetchPolicy: "no-cache"
	})

	useEffect(() => {
		//initDatosPrueba()
		setLoading(true)
		getMyDeliveryZones({ variables: { after: '', before: '', carrier: carrierID } })
	}, [])

	useEffect(() => {
		setMyDeliveryAreas(deliveryAreasStore)
	}, [deliveryAreasStore])

	const reloadApp = () => {
		setReLoading(true)
		getMyDeliveryZones({ variables: { after: '', before: '', carrier: carrierID } })
	}

	const onRefresh = () => {
		setRefreshing(true)
		getMyDeliveryZones({ variables: { after: '', before: '', carrier: carrierID } })

	}

	const actionIcon = (name) => {
		if (name === 'edit-location') {
			return (
				<MaterialIcons
					name={name}
					size={22}
					color={colors.SURFACE}
				/>
			)
		} else {
			return (
				<FontAwesome
					name={name}
					size={18}
					color={colors.SURFACE}
				/>
			)
		}

	}

	const actionsButton = [
		{
			text: "Actualizar",
			icon: actionIcon('refresh'),
			name: "bt_update",
			position: 2,
			color: Colors.COLORS.PRIMARY
		},
		{
			text: "Editar Zonas",
			icon: actionIcon('edit-location'),
			name: "bt_edit_zones",
			position: 1,
			color: Colors.COLORS.PRIMARY
		}
	];

	const doAction = (action) => {
		switch (action) {
			case 'bt_edit_zones':
				navigation.navigate('DeliveryAreasForm')
				break;
			case 'bt_update':
				onRefresh()
				break;
		}
	}

	if (reLoading || loading) return <Loading />

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
								style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 15 }}
							>
								<Typography bold h3 color={colors.ON_BACKGROUND}>
									No se encontraron zonas de entrega.
								</Typography>
								{/* <Typography color={colors.ON_BACKGROUND}>
									Las zonas de entrega se utilizan para mostrar pedidos correspondientes con las zonas.
								</Typography> */}
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
					<FloatingAction
						color={Colors.COLORS.PRIMARY}
						actions={actionsButton}
						onPressItem={name => {
							doAction(name)
						}}
					/>
					{/* <FloatingActionButton
						icon={'edit'}
						onPress={() => {
							navigation.navigate('DeliveryAreasForm')
						}}
					/> */}
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
