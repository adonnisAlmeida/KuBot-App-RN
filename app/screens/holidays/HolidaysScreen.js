import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Platform, StyleSheet, ToastAndroid, View } from 'react-native'

import HolidaysList from './components/HolidaysList'
import { Loading, NetworkError } from '../../components'

import { useDispatch, useSelector } from 'react-redux'
import { getHolyDaysByUser, setHolyDaysByUser, removeHolyDaysByUser } from '../../redux/holydays/holydaysSlice'
import { DELETE_HOLIDAY, GET_HOLYDAYS_BY_CARRIER } from '../../graphql/holydays'
import { useLazyQuery, useMutation } from '@apollo/client'
import AwesomeAlert from 'react-native-awesome-alerts'
import { useTheme } from '@react-navigation/native'
import { CARRIER_INFO } from '../../graphql/login'
import { setCarrierInfo } from '../../redux/userlogin/userLoginSlice'


export default function HolidaysScreen({ navigation }) {
	const [loadingApp, setLoadingApp] = useState(false)
	const [loadingScroll, setLoadingScroll] = useState(false)
	const [refreshing, setRefreshing] = useState(false)
	const [myHolyDays, setMyHolyDays] = useState([])
	const [hasNextPage, setHasNextPage] = useState(false)
	const [endCursor, setEndCursor] = useState("")
	const [alertMessage, setAlertMessage] = useState(null)
	const [alertTitle, setAlertTitle] = useState(null)
	const [showAlertAw, setShowAlert] = useState(false)
	const [deleteIds, setDeleteIds] = useState(null)
	const [displayLoading, setDisplayLoading] = useState(false)
	const [refreshingOtro, setRefreshingOtro] = useState(false)
	const dispatch = useDispatch()
	const { colors } = useTheme()
	const holyDaysStore = useSelector(state => state.holydays)

	const userStore = useSelector(state => state.userlogin)
	const carrierID = userStore.carrierInfo.serverId;

	const [getHolyDays, { loading, error, data }] = useLazyQuery(GET_HOLYDAYS_BY_CARRIER, {
		onCompleted: (data) => {
			if (data.vacations.pageInfo.hasNextPage) {
				setHasNextPage(data.vacations.pageInfo.hasNextPage)
				setEndCursor(data.vacations.pageInfo.endCursor)
			} else {
				setHasNextPage(false)
			}
			if (loadingApp || refreshing) {
				setMyHolyDays(data.vacations.edges)
				dispatch(setHolyDaysByUser(data.vacations.edges))
			} else {
				setMyHolyDays([...myHolyDays, ...data.vacations.edges])
				dispatch(setHolyDaysByUser([...myHolyDays, ...data.vacations.edges]))
			}
			//let fromStorage = holyDaysStore.hoylyDays
			//dispatch(setHolyDaysByUser(data.vacations.edges))
			setLoadingApp(false)
			setLoadingScroll(false)
			setRefreshing(false)
			setRefreshingOtro(false)
		},
		onError: () => {
			console.log('Error cargando vacaiones >> ', error)
			setLoadingApp(false)
			setLoadingScroll(false)
			setRefreshing(false)
			setRefreshingOtro(false)
		},
		fetchPolicy: "no-cache"
	})

	const [getCarrierInfo, { loadingCI, errorCI, dataCI }] = useLazyQuery(CARRIER_INFO, {
		onCompleted: (dataCI) => {
			dispatch(setCarrierInfo(dataCI.myCarrierInfo))
		},
		onError: (errorCI) => {
			dispatch(setCarrierInfo({}))
			console.log('ERROR GET_CARRIER_BY_USER_EMAIL >> ', JSON.stringify(errorCI, null, 2))
		},
		fetchPolicy: "no-cache",
	})

	const [deleteHolyDays, { loadingDelete, errorDelete, dataDelete }] = useMutation(DELETE_HOLIDAY, {
		onCompleted: (dataDelete) => {
			/* let newElements = myHolyDays.filter((holy) => holy.node.serverId != dataDelete.vacationDelete.vacation.serverId)
			dispatch(setHolyDaysByUser(newElements)) */
			/* if(deleteIdsReal.length == 1 && deleteIdsReal[0] == dataDelete.vacationDelete.vacation.id){
				setDeleteIdsReal(deleteIdsReal.filter((list) => !deleteIdsReal.includes(dataDelete.vacationDelete.vacation.id)))
				console.log("Acaba de elimianr el ultimo")
			}else {
				console.log("Todavia esta eliminado")
			} */
			/* console.log("elimi >> ", dataDelete.vacationDelete.vacation.id)
			console.log("Antess >> ", deleteIdsReal)
			setDeleteIdsReal(deleteIdsReal.filter((list) => !deleteIdsReal.includes(dataDelete.vacationDelete.vacation.id)))
			console.log("Despues >> ", deleteIdsReal) */
			console.log("Termino de eliminar")
			/* setShowAlert(false)
			setLoadingApp(false) */
		},
		onError: () => {
			console.log('Error eliminando vacaiones >> ', errorDelete)
			setShowAlert(false)
			setLoadingApp(false)
		}
	})

	useEffect(() => {
		dispatch(setHolyDaysByUser([]))
		setLoadingApp(true)
		getHolyDays({ variables: { carrierServerId: carrierID, after: '', before: '' } })
	}, [])

	useEffect(() => {
		setMyHolyDays(holyDaysStore.hoylyDays)
		setLoadingApp(false)
	}, [holyDaysStore.hoylyDays])

	const delete_holidays = (ids) => {
		setAlertMessage(`¿Está seguro que desea eliminar las vacaciones?`)
		setAlertTitle('¿Está seguro?')
		setShowAlert(true)
		setDeleteIds(ids)
	}

	const doDeleteHolyday = () => {
		setShowAlert(false)
		setDisplayLoading(true)
		let temporal = deleteIds
		deleteIds.forEach(async id => {
			await deleteHolyDays({ variables: { id: id } })
			temporal = temporal.filter(elem => elem !== id)
			if (temporal.length == 0) {
				console.log("termino completo")
				getCarrierInfo()
				setShowAlert(false)
				setLoadingApp(false)
				dispatch(removeHolyDaysByUser(deleteIds))
				setDisplayLoading(false)
				if (Platform.OS === 'android')
					ToastAndroid.show('Vacaciones eliminadas correctamente.', ToastAndroid.LONG)
			}
		});
	}

	const renderLoader = () => {
		return loadingScroll ? <Loading /> : null
	}

	const loadMore = () => {
		if (hasNextPage) {
			setLoadingScroll(true)
			console.log(`CARGA MAS DATOSSS con endCursor > ${endCursor}`)
			getHolyDays({ variables: { carrierServerId: carrierID, after: endCursor, before: '' } })
		} else {
			console.log(`No hay datos para cargar HolidaysScreen`)
		}
	}

	const reloadApp = () => {
		setLoadingApp(true)
		getHolyDays({ variables: { carrierServerId: carrierID, after: '', before: '' } })
	}

	const doRefresh = () => {
		setRefreshing(true)
		setRefreshingOtro(true)
		getHolyDays({ variables: { carrierServerId: carrierID, after: '', before: '' } })
	}

	/* setTimeout(() => {
		if (loadingApp) setLoadingApp(false)
	}, 2000) */

	if (loadingApp || loading) return <Loading />
	//if (loading) return <Loading />

	return (
		<View style={{ flex: 1 }}>
			{error ?
				(
					<NetworkError accion={reloadApp} />
				) :
				(
					<>
						<HolidaysList
							navigation={navigation}
							holidays_list={myHolyDays}
							delete_holidays={delete_holidays}
							doRefresh={doRefresh}
							loadMore={loadMore}
							renderLoader={renderLoader}
							refreshingOtro={refreshingOtro}
						/>
						<AwesomeAlert
							show={showAlertAw}
							showProgress={false}
							title={alertTitle}
							message={alertMessage}
							closeOnTouchOutside={false}
							closeOnHardwareBackPress={false}
							showCancelButton={true}
							showConfirmButton={true}
							cancelText="Cancelar"
							confirmText="Eliminar"
							confirmButtonColor="#FB6340"
							onCancelPressed={() => {
								setShowAlert(false)
							}}
							onConfirmPressed={() => {
								doDeleteHolyday()
							}}
						/>
					</>
				)
			}
			{displayLoading ? (
                <View style={styles.loadingAccept}>
                    <ActivityIndicator size={50} color={colors.PRIMARY} />
                </View>
            ) : (null)}
		</View>
	)
}

const styles = StyleSheet.create({
    loadingAccept: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
        zIndex: 5,
        elevation: 3,
    },
})
