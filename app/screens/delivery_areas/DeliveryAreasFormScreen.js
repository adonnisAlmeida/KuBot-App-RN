import React, { createRef, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	Platform,
	ToastAndroid,
	View,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	Text
} from 'react-native'
import { useTheme } from '@react-navigation/native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { Button, Loading, NetworkError, Typography } from '../../components'
import { provincias } from '../../constants/mock'
import {
	allDeliveryAreas,
	deliveryAreasIds,
	getDeliveryAreasIds,
	listado,
	setAllDeliveryAreas,
	setDeliveryAreas,
	setDeliveryAreasIds,
} from '../../redux/deliveryareas/deliveryareasSlice'
import { ADD_DELIVERY_ZONES, DELIVERY_ZONES } from '../../graphql/deliveryAreas'
import { useLazyQuery, useMutation } from '@apollo/client'
import AwesomeAlert from 'react-native-awesome-alerts'
import Colors from '../../constants/Colors'
import ProvinciaComponet from './componets/ProvinciaComponet'


export default function DeliveryAreasFormScreen({ navigation }) {
	const [loadingApp, setLoadingApp] = useState(false)
	const [alertMessage, setAlertMessage] = useState(null)
	const [alertTitle, setAlertTitle] = useState(null)
	const [showAlertAw, setShowAlert] = useState(false)
	const [selectedIds, setSelectedIds] = useState([])
	const [selectedMun, setSelectedMun] = useState([])
	const dispatch = useDispatch()
	const delivery = useSelector(listado)
	const { colors } = useTheme()
	const [provinciasList, setProvinciasList] = useState([])
	const [provinciasListTemp, setProvinciasListTemp] = useState([])
	const deliveryAreasStore = useSelector(store => store.deliveryareas)
	const allDeliveryAreasStore = useSelector(allDeliveryAreas)
	//const deliveryAreasIdsStore = useSelector(deliveryAreasIds)
	const listadoStore = useSelector(listado)
	const userStore = useSelector(state => state.userlogin)
	const carrierID = userStore.carrierInfo.serverId;


	const [addDeliveryZones, { loadingAdd, errorAdd, dataAdd }] = useMutation(ADD_DELIVERY_ZONES, {
		onCompleted: (data) => {
			//dispatch(setDeliveryAreasIds(selectedIds))
			dispatch(setDeliveryAreas(selectedMun))
			setShowAlert(false)
			if (Platform.OS === 'android') {
				ToastAndroid.show('Se actualizaron las zonas de entrega.', ToastAndroid.LONG)
			}
			navigation.goBack();
		},
		onError: () => {
			setShowAlert(false)
			if (Platform.OS === 'android') {
				ToastAndroid.show('Error actualizando zonas entrega.', ToastAndroid.LONG)
			}
			navigation.goBack();
			console.log('Error adicionando zonas entrega', error)
		}
	})

	const [getDeliveryZones, { loading, error, data }] = useLazyQuery(DELIVERY_ZONES, {
		onCompleted: (data) => {
			console.log('OnCOmplete OK >>>>', data.deliveryZones.edges.length)
			const allResult = data.deliveryZones.edges
			let groupedProvinces = []

			allResult.map((prov, index) => {
				if (prov.node.parent !== null) {
					let flag = false
					groupedProvinces.map((provi, i) => {
						if (prov.node.parent.id == provi.id) {
							provi.municipios.push(prov)
							flag = true
						}
					})
					if (!flag) {
						var father = {
							'id': prov.node.parent.id,
							'name': prov.node.parent.name,
							'municipios': [prov]
						}
						groupedProvinces.push(father)
					}
				}
			})
			if (data.deliveryZones.pageInfo.hasNextPage) {
				setProvinciasListTemp(groupedProvinces)
				getDeliveryZones({ variables: { after: data.deliveryZones.pageInfo.endCursor, before: '' } })
			} else {
				let temporal = []
				provinciasListTemp.forEach(item => temporal.push(item))
				groupedProvinces.map((groupProv) => {
					let flag = false
					temporal.map((prov) => {
						if (groupProv.name == prov.name) {
							flag = true
							prov.municipios = prov.municipios.concat(groupProv.municipios)
						}
					})
					if (!flag) {
						temporal = temporal.concat(groupProv)
					}
				})
				setLoadingApp(false)
				setProvinciasList(temporal)
				dispatch(setAllDeliveryAreas(temporal))
			}
		},
		onError: (error) => {
			setLoadingApp(false)
			console.log('Error cargando todas las zonas de entrega', error)
		}
	})

	useEffect(() => {
		if (allDeliveryAreasStore.length == 0) {// no ha cargado todas las zonas todavia
			console.log('Esta vacio carga ')
			setLoadingApp(true)
			getDeliveryZones({ variables: { after: '', before: '' } })
		} else { // ya los cargo estane l localstorage
			setProvinciasList(allDeliveryAreasStore)
		}

		setSelectedMun(listadoStore)
		//setSelectedIds(deliveryAreasIdsStore)
	}, [])

	useEffect(() => {
		//setSelectedIds(deliveryAreasIdsStore)
		setSelectedMun(listadoStore)
	}, [listadoStore])


	const guardar = () => { // OJO falta actualizarlo en back
		console.log('a guardar con  >> ', selectedMun.length)

		setAlertTitle("Actualizando Zonas de entrega")
		setShowAlert(true)
		let serverIds = []
		selectedMun.map((mun) => {
			serverIds.push(mun.node.serverId)
		})
		addDeliveryZones({ variables: { carrier: carrierID, ids: serverIds } })
	}

	const reloadApp = () => {
		setLoadingApp(true)
		getDeliveryZones({ variables: { after: '', before: '' } })
	}

	if (loadingApp) return <Loading />

	return (
		<View style={styles.constains}>
			{error ?
				(
					<NetworkError accion={reloadApp} />
				) :
				(
					<>
						<ScrollView showsVerticalScrollIndicator={false}>
							{provinciasList.map((provincia, index) => {
								return (
									<ProvinciaComponet
										key={provincia.id}
										provincia={provincia}
										selectedMun={selectedMun}
										setSelectedMun={setSelectedMun}
									/>
								)
							})}
						</ScrollView>
						<View style={{ marginTop: 16 }}>
							<Button color={Colors.COLORS.WEB_BUTTON} style={{ alignItems: 'center' }} onPress={() => guardar()}>
								<Typography color="#ffffff">Guardar</Typography>
							</Button>
						</View>
					</>
				)
			}
			<AwesomeAlert
				show={showAlertAw}
				showProgress={true}
				title={alertTitle}
				//message={alertMessage}
				closeOnTouchOutside={false}
				closeOnHardwareBackPress={false}
			/* showCancelButton={true}
			showConfirmButton={true}
			cancelText="Cancelar"
			confirmText="Eliminar"
			confirmButtonColor={Colors.COLORS.ERROR}
			onCancelPressed={() => {
				setShowAlert(false)
			}}
			onConfirmPressed={() => {
				doDelete()
			}} */
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	constains: {
		flex: 1,
		padding: 16,
	},
	element: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderColor: 'transparent',
		borderRadius: 8,
		marginVertical: 5,
		paddingVertical: 12,
		paddingHorizontal: 16,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 1.5 },
		shadowRadius: 8,
		elevation: 1
	},
	subelement: {
		marginLeft: 28,
		display: 'none',
		overflow: 'hidden',
	}
})
