import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ClientsList from './components/ClientsList'
import { useLazyQuery } from '@apollo/client'
import { ORDERS_LIST_CLIENTS } from '../../graphql/clients'
import { Loading, NetworkError } from '../../components'
import { getClientsByUser, setClientsByUser } from '../../redux/clients/clientsSlice'

const ClientsScreen = ({ navigation }) => {
    const [loadingApp, setLoadingApp] = useState(false)
    const [myClients, setMyClients] = useState({})
    const [refreshing, setRefreshing] = useState(false)
    const dispatch = useDispatch()
    const clientsStore = useSelector(state => state.clients)
    const userStore = useSelector(state => state.userlogin)
    const carrierID = userStore.carrierInfo.serverId;

    const [getClients, { loading, error, data }] = useLazyQuery(ORDERS_LIST_CLIENTS, {
        onCompleted: (data) => {
            setLoadingApp(false)
            setRefreshing(false)
        },
        onError: () => {
            setLoadingApp(false)
            setRefreshing(false)
            console.log('Error cargando lista de clientes ', error)
        },
        fetchPolicy: "no-cache"
    })

    useEffect(() => {
        getClients({ variables: { carrier: carrierID } })
        dispatch(getClientsByUser())
    }, [])

    useEffect(() => {
        if (data) {
            const ordenes = data.orders.edges
            let temp = []
            ordenes.forEach(el => {
                if (el.node.user != null && el.node.user) {
                    if (temp.filter(e => e.user.id === el.node.user.id).length > 0) {
                        return
                    } else {
                        temp.push(el.node)
                    }
                }
            })

            dispatch(setClientsByUser(temp))
            setMyClients(temp)
            setLoadingApp(false)

            /* const groupedItems = ordenes.reduce((results, item) => {
                if (item.node.user !== null) {
                    (results[item.node.user.id] = results[item.node.user.id] || []).push(item.node.user)
                }
                return results
            }, {})
            const propertyValues = Object.values(groupedItems)
            dispatch(setClientsByUser(propertyValues))
            setMyClients(propertyValues)
            setLoadingApp(false) */
        }
    }, [clientsStore.clients, data])

    const reloadApp = () => {
        setLoadingApp(true)
        getClients({ variables: { carrier: carrierID } })
    }

    const doRefresh = () => {
        setRefreshing(true)
        getClients({ variables: { carrier: carrierID } })
    }

    setTimeout(() => {
        if (loadingApp) setLoadingApp(false)
    }, 2000)

    if (loadingApp) return <Loading />
    if (loading && (Object.keys(myClients).length === 0 && myClients.constructor === Object)) return <Loading />

    return (
        <View style={{ flex: 1 }}>
            {error ?
                (
                    <NetworkError accion={reloadApp} />
                ) : (
                    <ClientsList
                        navigation={navigation}
                        clients_list={myClients}
                        doRefresh={doRefresh}
                        refreshing={refreshing}
                    />
                )}

        </View>
    )
}

export default ClientsScreen