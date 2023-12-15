import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { useLazyQuery } from '@apollo/client'
import { FloatingAction } from "react-native-floating-action";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { Loading, NetworkError, Typography } from '../../components'
import MessengerOrdersList from './components/MessengerOrdersList'

import { ORDERS_LIST } from '../../graphql/orders'
import { useDispatch, useSelector } from 'react-redux'
import Colors from '../../constants/Colors';
import { useTheme } from '@react-navigation/native';
import { setMessengerOrders } from '../../redux/messenger_orders/messenger_ordersSlice';
import FilterModal from './components/navigate_views/components/FilterModal';
import FilterMainHeader from './components/navigate_views/components/FilterMainHeader';
import moment from 'moment'
moment.locale('es')


export default function MessengerOrdersScreen({ navigation }) {
	const { dark, colors } = useTheme()
	const [loadingApp, setLoadingApp] = useState(false)
	const [myOrders, setMyOrders] = useState([])
	const [refreshing, setRefreshing] = useState(false)
	const [loadingScroll, setLoadingScroll] = useState(false)
	const [loadingFilter, setLoadingFilter] = useState(false)
	const [hasNextPage, setHasNextPage] = useState(false)
	const [showFilter, setShowFilter] = useState(false)
	const [comeFromHeader, setComeFromHeader] = useState(false)
	const [endCursor, setEndCursor] = useState("")
	const [activeView, setActiveView] = useState(1)
	const [aborterRef, setAbortRef] = useState(new AbortController());
	const [filterOptions, setFilterOptions] = useState({
		number: null,
		country: null,
		countryCode: null,
		province: null,
		municipality: null,
		state: null,
		seller: null,
		sellerObject: null,
		client: null,
		clientObject: null,
		from: null,
		to: null
	})
	const [activeFilters, setActiveFilters] = useState({
		number: false,
		country: false,
		province: false,
		municipality: false,
		state: false,
		seller: false,
		client: false,
		date: false
	})
	const [provinciaIndex, setProvinciaIndex] = useState(-1)
	const userStore = useSelector(state => state.userlogin)
	const messengerOrdersRedux = useSelector(state => state.messengerOrders)
	const dispatch = useDispatch()
	const carrierID = userStore.carrierInfo.serverId;


	const [getOrdersList, { loading, error, data }] = useLazyQuery(ORDERS_LIST, {
		onCompleted: (data) => {
			console.log("TERMINO CARGAR ORDENES >>>>")
			if (data.orders.pageInfo.hasNextPage) {
				setHasNextPage(data.orders.pageInfo.hasNextPage)
				setEndCursor(data.orders.pageInfo.endCursor)
			} else {
				setHasNextPage(false)
			}
			if (loadingApp || refreshing || loadingFilter) {
				let elementos = []
				data.orders.edges.map((edges) => elementos.push(edges.node))
				setMyOrders(elementos)
				dispatch(setMessengerOrders(elementos))
			} else {
				let elementos = []
				data.orders.edges.map((edges) => elementos.push(edges.node))
				setMyOrders([...myOrders, ...elementos])
				dispatch(setMessengerOrders([...myOrders, ...elementos]))
			}
			/* let elementos = []
			data.orders.edges.map((edges) => elementos.push(edges.node))
			setMyOrders(elementos) */
			setLoadingApp(false)
			setLoadingFilter(false)
			setRefreshing(false)
			setLoadingScroll(false)
		},
		onError: (error, data) => {
			/* if (error.message == 'Aborted') {
				console.log('ERROR cargando ordenes >> ', error)
				console.log('ERROR cargando ordenes data var >> ', data)
				setLoadingApp(false)
				setRefreshing(false)
				setLoadingScroll(false)
			} */
			setFilterOptions({
				number: null,
				country: null,
				countryCode: null,
				province: null,
				municipality: null,
				state: null,
				seller: null,
				sellerObject: null,
				client: null,
				clientObject: null,
				from: null,
				to: null
			})
			setActiveFilters({
				number: false,
				country: false,
				province: false,
				municipality: false,
				state: false,
				seller: false,
				client: false,
				date: false
			})
			console.log('ERROR cargando ordenes >> ', JSON.stringify(error, null, 2))
			console.log('ERROR cargando ordenes data var >> ', JSON.stringify(data, null, 2))
			setLoadingApp(false)
			setLoadingFilter(false)
			setRefreshing(false)
			setLoadingScroll(false)

		},
		context: {
			fetchOptions: {
				signal: aborterRef.signal
			}
		},
		fetchPolicy: "no-cache"
	})




	useEffect(() => {
		setLoadingApp(true)
		getOrdersList({ variables: { carrier: carrierID, after: '', before: '' } })
	}, [])

	useEffect(() => {
		setMyOrders(messengerOrdersRedux.listado)
	}, [messengerOrdersRedux.listado])

	const renderLoader = () => {
		return loadingScroll ? <Loading /> : null
	}

	const loadMore = () => {
		if (hasNextPage) {
			setLoadingScroll(true)
			getOrdersList({ variables: { carrier: carrierID, after: endCursor, before: '' } })
		}
	}

	const reloadApp = () => {
		setLoadingApp(true)
		getOrdersList({ variables: { carrier: carrierID, after: '', before: '' } })
	}

	const doRefresh = () => {
		setRefreshing(true)
		getOrdersList({ variables: { carrier: carrierID, after: '', before: '' } })
	}

	const doAction = (action) => {
		switch (action) {
			case 'filter':
				setComeFromHeader(false)
				setShowFilter(true)
				break;
		}
	}

	const actionIcon = (name) => {
		return (
			<MaterialCommunityIcons
				name={name}
				size={25}
				color={colors.SURFACE}
			/>
		)
	}

	const actionsFilter = [
		{
			text: "Filtrar",
			icon: actionIcon('filter-plus'),
			name: "filter",
			position: 2,
			color: Colors.COLORS.PRIMARY
		}
	];

	const clearFilters = () => {
		setActiveFilters({
			number: false,
			country: false,
			province: false,
			municipality: false,
			state: false,
			seller: false,
			client: false,
			date: false
		})
		setFilterOptions({
			number: null,
			country: 'Cuba',
			countryCode: 'CU',
			province: null,
			municipality: null,
			state: null,
			seller: null,
			sellerObject: null,
			client: null,
			clientObject: null,
			date: null
		})
		setProvinciaIndex(1)
	}

	const applyFilters = (param) => {
		let filter = {}
		switch (param?.from) {
			case 'client':
				filter = {
					"client": param.value,
					"seller": filterOptions.seller?.serverId,
					"country": filterOptions.countryCode,
					"municipality": filterOptions.municipality,
					"province": filterOptions.province,
					"shippingStatus": filterOptions.state,
					"number": filterOptions.number,
					"created": {
						"gte": filterOptions.from,
						"lte": filterOptions.to,
					}
				}
				break;
			case 'seller':
				filter = {
					"client": filterOptions.client?.serverId,
					"seller": param.value,
					"country": filterOptions.countryCode,
					"municipality": filterOptions.municipality,
					"province": filterOptions.province,
					"shippingStatus": filterOptions.state,
					"number": filterOptions.number,
					"created": {
						"gte": filterOptions.from,
						"lte": filterOptions.to,
					}
				}
				break;
			case 'country':
				filter = {
					"client": filterOptions.client?.serverId,
					"seller": filterOptions.seller?.serverId,
					"country": param.value,
					"municipality": filterOptions.municipality,
					"province": filterOptions.province,
					"shippingStatus": filterOptions.state,
					"number": filterOptions.number,
					"created": {
						"gte": filterOptions.from,
						"lte": filterOptions.to,
					}
				}
				break;
			case 'municipality':
				filter = {
					"client": filterOptions.client?.serverId,
					"seller": filterOptions.seller?.serverId,
					"country": filterOptions.countryCode,
					"municipality": param.value,
					"province": filterOptions.province,
					"shippingStatus": filterOptions.state,
					"number": filterOptions.number,
					"created": {
						"gte": filterOptions.from,
						"lte": filterOptions.to,
					}
				}
				break;
			case 'province':
				filter = {
					"client": filterOptions.client?.serverId,
					"seller": filterOptions.seller?.serverId,
					"country": filterOptions.countryCode,
					"municipality": null,
					"province": param.value,
					"shippingStatus": filterOptions.state,
					"number": filterOptions.number,
					"created": {
						"gte": filterOptions.from,
						"lte": filterOptions.to,
					}
				}
				break;
			case 'shippingStatus':
				filter = {
					"client": filterOptions.client?.serverId,
					"seller": filterOptions.seller?.serverId,
					"country": filterOptions.countryCode,
					"municipality": filterOptions.municipality,
					"province": filterOptions.province,
					"shippingStatus": param.value,
					"number": filterOptions.number,
					"created": {
						"gte": filterOptions.from,
						"lte": filterOptions.to,
					}
				}
				break;
			case 'number':
				filter = {
					"client": filterOptions.client?.serverId,
					"seller": filterOptions.seller?.serverId,
					"country": filterOptions.countryCode,
					"municipality": filterOptions.municipality,
					"province": filterOptions.province,
					"shippingStatus": filterOptions.state,
					"number": param.value,
					"created": {
						"gte": filterOptions.from,
						"lte": filterOptions.to,
					}
				}
				break;
			case 'to':
				filter = {
					"client": filterOptions.client?.serverId,
					"seller": filterOptions.seller?.serverId,
					"country": filterOptions.countryCode,
					"municipality": filterOptions.municipality,
					"province": filterOptions.province,
					"shippingStatus": filterOptions.state,
					"number": filterOptions.number,
					"created": {
						"gte": filterOptions.from ? moment(filterOptions.from.toString()).format('YYYY-MM-DD'): null,
						"lte": moment(param.value.toString()).format('YYYY-MM-DD'),
					}
				}
				break;
			case 'from':
				filter = {
					"client": filterOptions.client?.serverId,
					"seller": filterOptions.seller?.serverId,
					"country": filterOptions.countryCode,
					"municipality": filterOptions.municipality,
					"province": filterOptions.province,
					"shippingStatus": filterOptions.state,
					"number": filterOptions.number,
					"created": {
						"gte": moment(param.value.toString()).format('YYYY-MM-DD'),
						"lte": filterOptions.to ? moment(filterOptions.to.toString()).format('YYYY-MM-DD'): null,
					}
				}
				break;
			case 'date':
				filter = {
					"client": filterOptions.client?.serverId,
					"seller": filterOptions.seller?.serverId,
					"country": filterOptions.countryCode,
					"municipality": filterOptions.municipality,
					"province": filterOptions.province,
					"shippingStatus": filterOptions.state,
					"number": filterOptions.number,
					"created": param.value
				}
				break;

			default:
				filter = {
					"client": filterOptions.client?.serverId,
					"seller": filterOptions.seller?.serverId,
					"country": filterOptions.countryCode,
					"municipality": filterOptions.municipality,
					"province": filterOptions.province,
					"shippingStatus": filterOptions.state,
					"number": filterOptions.number,
					"created": {
						"gte": filterOptions.from ? moment(filterOptions.from.toString()).format('YYYY-MM-DD'): null,
						"lte": filterOptions.to ? moment(filterOptions.to.toString()).format('YYYY-MM-DD'): null,
					}
				}
				break;
		}
		console.log('APLICAR FILTROS CON  >> ', filter)
		setLoadingFilter(true)
		getOrdersList({ variables: { carrier: carrierID, after: '', before: '', filter: filter } })
	}

	if (loadingApp) return <Loading />

	return (
		<View style={{ flex: 1 }}>
			{error && error.message != 'Aborted' ?
				(
					<NetworkError accion={reloadApp} />
				) :
				(
					<>
						{
							(
								activeFilters.number || activeFilters.country || activeFilters.province
								|| activeFilters.municipality || activeFilters.state || activeFilters.seller
								|| activeFilters.client || activeFilters.date) ? (
								<FilterMainHeader
									setShowFilter={setShowFilter}
									activeFilters={activeFilters}
									filterOptions={filterOptions}
									setActiveView={setActiveView}
									setComeFromHeader={setComeFromHeader}
								/>
							) : (null)
						}
						{loadingFilter ? (
							<View
								style={{
									position: 'absolute',
									zIndex: 9999,
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									backgroundColor: 'rgba(1,1,1,0.2)',
									//paddingTop: (height / 2) - 50
								}}
							>
								<ActivityIndicator size="large" color={Colors.COLORS.PRIMARY} />
							</View>
						) : (null)}
						<MessengerOrdersList
							navigation={navigation}
							messenger_orders_list={myOrders}
							doRefresh={doRefresh}
							loadMore={loadMore}
							renderLoader={renderLoader}
							refreshing={refreshing}
							activeFilters={activeFilters}
						/>

						<FilterModal
							activeView={activeView}
							setComeFromHeader={setComeFromHeader}
							comeFromHeader={comeFromHeader}
							setActiveView={setActiveView}
							applyFilters={applyFilters}
							showFilter={showFilter}
							setShowFilter={setShowFilter}
							setFilterOptions={setFilterOptions}
							filterOptions={filterOptions}
							setActiveFilters={setActiveFilters}
							activeFilters={activeFilters}
							clearFilters={clearFilters}
							provinciaIndex={provinciaIndex}
							setProvinciaIndex={setProvinciaIndex}
						/>
						<FloatingAction
							overrideWithAction={true}
							//floatingIcon={<FontAwesome name='filter' size={25} color={colors.SURFACE} />}
							color={Colors.COLORS.PRIMARY}
							actions={actionsFilter}
							onPressItem={name => {
								doAction(name)
							}}
						/>
					</>
				)
			}
		</View>
	)
}

