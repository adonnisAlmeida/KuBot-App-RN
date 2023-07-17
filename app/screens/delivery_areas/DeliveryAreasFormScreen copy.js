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
	const [ref_ico_element, setRef_ico_element] = useState([]);
	const [ref_num_element, setRef_num_element] = useState([]);
	const deliveryAreasStore = useSelector(store => store.deliveryareas)
	const userStore = useSelector(state => state.userlogin)
	const carrierID = userStore.carrierInfo.serverId;

	
	const [addDeliveryZones, { loadingAdd, errorAdd, dataAdd }] = useMutation(ADD_DELIVERY_ZONES, {
		onCompleted: (data) => {
			dispatch(setDeliveryAreasIds(selectedIds))
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
				setProvinciasList(groupedProvinces)
				getDeliveryZones({ variables: { after: data.deliveryZones.pageInfo.endCursor, before: '' } })
			} else {
				let temporal = []
				provinciasList.forEach(item => temporal.push(item))
				groupedProvinces.map((groupProv) => {
					let flag = false
					temporal.map((prov) => {
						if(groupProv.name == prov.name){
							flag = true
							prov.municipios = prov.municipios.concat(groupProv.municipios)
						}
					})
					if(!flag){
						temporal = temporal.concat(groupProv)
					}
				})
				setProvinciasList(temporal)
				dispatch(setAllDeliveryAreas(temporal))
			}
			/* let ultimoStorage = deliveryAreasStore.allDeliveryAreas.slice(-1);
			let primeroConsulta = groupedProvinces[0]
			let finalGrouped = []
			if (ultimoStorage[0]) {
				if (ultimoStorage[0].name == primeroConsulta.name) {
					ultimoStorage[0].municipios.map((mun)=> {
						primeroConsulta.municipios.push(mun)
						let temp = primeroConsulta
						groupedProvinces.shift()
						let penult = deliveryAreasStore.allDeliveryAreas.filter((mun) => ultimoStorage != mun)
						finalGrouped = penult.concat(groupedProvinces)
					})
				}
			}else {
				finalGrouped = groupedProvinces
			}
			dispatch(setAllDeliveryAreas(finalGrouped))
			setProvinciasList(finalGrouped)
			setRef_ico_element((ref_ico_element) =>
				Array(groupedProvinces.length)
					.fill()
					.map((_, i) => ref_ico_element[i] || createRef()),
			)
			setRef_num_element((ref_num_element) =>
				Array(groupedProvinces.length)
					.fill()
					.map((_, i) => ref_num_element[i] || createRef()),
			); */
			setLoadingApp(false)
		},
		onError: () => {
			setLoadingApp(false)
			console.log('Error cargando todas las zonas de entrega', error)
		}
	})

	const otroPrueba = () => {
		let primero = [
			{
				'name': 'paco',
				'mun': [1, 2, 3]
			},
			{
				'name': 'dod',
				'mun': [1, 2, 3]
			}
		]
		let segundo = [
			{
				'name': 'manolo',
				'mun': [1, 2, 3]
			},
			{
				'name': 'paco',
				'mun': [5, 6, 9]
			}
		]
		console.log(segundo)
		segundo.map((items, indexs) => {
			let temp
			primero.map((itemp, indexp) => {
				if (items.name == itemp.name) {
					console.log('Conincide en ', items.name)
					items.mun.map((m) => {
						itemp.mun.push(m)
					})
					segundo.splice(indexs, 1);
				}
			})
		})
		console.log(segundo)
		console.log(primero)
		console.log(primero.concat(segundo))
	}

	useEffect(() => {
		if (deliveryAreasStore.allDeliveryAreas.length == 0) {// no ha cargado todas las zonas todavia
			console.log('Esta vacio carga ')
			getDeliveryZones({ variables: { after: '', before: '' } })
		} else { // ya los cargo estane l localstorage
			setProvinciasList(deliveryAreasStore.allDeliveryAreas)
		}

		dispatch(getDeliveryAreasIds())
		setSelectedMun(deliveryAreasStore.listado)
		setSelectedIds(deliveryAreasStore.ids)
		//dispatch(setAllDeliveryAreas([]))
		//datosPrueba()
		//otroPrueba()
	}, [])

	useEffect(() => {
		setSelectedIds(deliveryAreasStore.ids)
		setSelectedMun(deliveryAreasStore.listado)
	}, [deliveryAreasStore.ids])
	/* useEffect(() => {
		if (data) {
			if (data.deliveryZones) {
				if (data.deliveryZones.pageInfo.hasNextPage) {
					getDeliveryZones({ variables: { after: data.deliveryZones.pageInfo.endCursor, before: '' } })
				}
			}
		}
	}, [data]) */

	/* useEffect(() => {
		setRef_ico_element((ref_ico_element) =>
			Array(provinciasList.length)
				.fill()
				.map((_, i) => ref_ico_element[i] || createRef()),
		)
		setRef_num_element((ref_num_element) =>
			Array(provinciasList.length)
				.fill()
				.map((_, i) => ref_num_element[i] || createRef()),
		);
	}, [provinciasList]); */

	const isCheckInitial = (mun) => {
		if (selectedIds.includes(mun.node.id)) {
			//setSelectionMun(mun.node.parent.id, mun.node.id, true)
			return true
		}
		return false
		/* const filter = selectedIds.filter((item) => item === mun.node.id)
		if (filter.length > 0) {
			setSelectionMun(mun.node.parent.id, mun.node.id, true)
			return true
		}
		return false */
	}

	const isCheck = (mun) => mun.isCheck == undefined
		? isCheckInitial(mun)
		: mun.isCheck

	const addDeliveryArea = (mun, muni_id) => {
		let tempId = selectedIds.filter((item) => item)
		tempId.push(muni_id)
		setSelectedIds(tempId)
		let tempMun = selectedMun.filter((item) => item)
		tempMun.push(mun)
		setSelectedMun(tempMun)
	}

	const deleteDeliveryArea = (mun, muni_id) => {
		let tempId = selectedIds.filter((item) => item != muni_id)
		setSelectedIds(tempId)
		let tempMun = selectedMun.filter((item) => item.node.id != mun.node.id)
		setSelectedMun(tempMun)
	}

	const setSelectionMun = (prov_id, muni_id, isCheck, mun) => {
		//console.log('CHECKED >> ', isCheck)
		if (selectedIds.includes(muni_id)) {
			deleteDeliveryArea(mun, muni_id)
		} else {
			addDeliveryArea(mun, muni_id)
		}
		/* if (isCheck) {
			addDeliveryArea(prov_id, muni_id)
		} else {
			deleteDeliveryArea(prov_id, muni_id)
		
		let provincia_id = provinciasList.filter(
			(provincia) => provincia.id === prov_id
		)
		const provincia_other = provinciasList.filter(
			(provincia) => provincia.id !== prov_id
		)

		let municipio_id = provincia_id[0].municipios.filter(
			(municipio) => municipio.node.id === muni_id
		)

		const municipio_other = provincia_id[0].municipios.filter(
			(municipio) => municipio.node.id !== muni_id
		)

		console.log('MNICICIC >> ', municipio_id)
		municipio_id[0]['isCheck'] = isCheck
		let municipio_order = [...municipio_id, ...municipio_other]
		provincia_id[0].municipios = municipio_order

		let provincias_order = [...provincia_id, ...provincia_other]
		//provincias_order.sort(compare_str)
		setProvinciasList(provincias_order) */
	}

	const onPressProv = (index) => {
		const visible = ref_ico_element[index].props.active
		//console.log(ref_num_element[index]);

		ref_ico_element[index].props = { ...ref_ico_element[index].props, active: !visible }
		//ref_ico_element[index].setNativeProps({ size: 50 })

		ref_num_element[index].setNativeProps({ style: { 'display': visible ? 'none' : 'flex' } })
	}

	const count_elementos_str = (length) => {
		return (
			<Typography light color={colors.ON_SURFACE}>
				{`(${length} municipio${length === 1 ? '' : 's'})`}
			</Typography>
		)
	}

	const guardar = () => { // OJO falta actualizarlo en back
		//console.log('GUARDAR ESTO >> ', selectedIds)
		//console.log('GUARDAR Y ESTO >> ', selectedMun)
		//setAlertMessage("Actualizando Zonas de entrega")
		setAlertTitle("Actualizando Zonas de entrega")
		setShowAlert(true)
		let serverIds = []
		selectedMun.map((mun) => {
			serverIds.push(mun.node.serverId)
		})
		addDeliveryZones({ variables: { carrier: carrierID, ids: serverIds } })
		/* dispatch(setDeliveryAreasIds(selectedIds))
		dispatch(setDeliveryAreas(selectedMun))
		if (Platform.OS === 'android') {
			ToastAndroid.show('Se actualizaron las zonas de entrega.', ToastAndroid.LONG)
		}
		navigation.goBack(); */
		/* let data = []
		provinciasList.map((prov) => {
			prov.municipios.map((muni) => {
				if (muni.isCheck === true)
					data.push({
						provinciaId: prov.id,
						provincia: prov.nombre,
						municipioId: muni.id,
						municipio: muni.nombre,
					})
			})
		})
		dispatch(setDeliveryAreas(data))
		if (Platform.OS === 'android') {
			ToastAndroid.show('Se guardo las zonas de entrega.', ToastAndroid.LONG)
		}
		navigation.goBack(); */
	}

	const reloadApp = () => {
		setLoadingApp(true)
		getDeliveryZones({ variables: { after: '', before: '' } })
	}

	setTimeout(() => {
		if (loadingApp) setLoadingApp(false)
	}, 2000)

	if (loading || loadingApp) return <Loading />

	return (
		<View style={styles.constains}>
			{/* error ?
				(
					<NetworkError accion={reloadApp} />
				) :
				( */
				<>
					<ScrollView showsVerticalScrollIndicator={false}>
						{provinciasList.map((prov, index) => {
							/* const ref_ico_element = makeReference()
							const ref_num_element = makeReference() */
							return (
								<View key={index}>
									<TouchableOpacity
										onPress={() => onPressProv(index)}
										style={[styles.element, { backgroundColor: colors.SURFACE }]}
									>
										<Typography
											color={colors.ON_SURFACE}
										>
											{prov.name} {count_elementos_str(prov.municipios.length)}
										</Typography>
										<FontAwesome
											active={false}
											//ref={ref_ico_element}
											ref={el => ref_ico_element[index] = el}
											name="chevron-down"
											color={colors.ON_SURFACE}
											size={16}
										/>
									</TouchableOpacity>
									<View style={styles.subelement} /* ref={ref_num_element} */ ref={el => ref_num_element[index] = el}>
										{prov.municipios.map((mun, index) => {
											return (
												<TouchableOpacity
													onPress={() =>
														setSelectionMun(
															prov.id,
															mun.node.id,
															mun.isCheck == undefined ? true : !mun.isCheck,
															mun
														)
													}
													key={index}
													style={[
														styles.element,
														{
															backgroundColor: colors.SURFACE,
														},
													]}
												>
													<Typography color={colors.ON_SURFACE}>
														{mun.node.name}
													</Typography>
													{isCheck(mun) && <FontAwesome
														name="check"
														color={colors.primary}
														size={20}
													/>}
												</TouchableOpacity>
											)
										})}
									</View>
								</View>
							)
						})}
					</ScrollView>
					<View style={{ marginTop: 16 }}>
						<Button color={Colors.COLORS.WEB_BUTTON} style={{ alignItems: 'center' }} onPress={() => guardar()}>
							<Typography color="#ffffff">Guardar</Typography>
						</Button>
					</View>
				</>
				/* ) */
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
