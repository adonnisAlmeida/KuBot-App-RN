import { Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ClientsList from './components/ClientsList'
import { useLazyQuery } from '@apollo/client'
import { MY_CLIENTS, ORDERS_LIST_CLIENTS } from '../../graphql/clients'
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
    const [loadingScroll, setLoadingScroll] = useState(false)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [endCursor, setEndCursor] = useState("")

    const [getMyClients, { loadingMyClients, errorMyClients, dataMyClients }] = useLazyQuery(MY_CLIENTS, {
        onCompleted: (dataMyClients) => {
            if (dataMyClients.myClients.pageInfo.hasNextPage) {
                setHasNextPage(dataMyClients.myClients.pageInfo.hasNextPage)
                setEndCursor(dataMyClients.myClients.pageInfo.endCursor)
            } else {
                setHasNextPage(false)
            }
            if (loadingApp || refreshing) {
                let elementos = []
                dataMyClients.myClients.edges.map((edges) => elementos.push(edges.node))
                setMyClients(elementos)
                dispatch(setClientsByUser(elementos))
            } else {
                let elementos = []
                dataMyClients.myClients.edges.map((edges) => elementos.push(edges.node))
                setMyClients([...myClients, ...elementos])
                dispatch(setClientsByUser([...myClients, ...elementos]))
            }
            setLoadingApp(false)
            setRefreshing(false)
            setLoadingScroll(false)
        },
        onError: (errorMyClients) => {
            setLoadingApp(false)
            setRefreshing(false)
            console.log('Error cargando lista de clientes ', errorMyClients)
        },
        fetchPolicy: "no-cache"
    })

    useEffect(() => {
        setLoadingApp(true)
        getMyClients({ variables: { after: '', before: '' } })
    }, [])

    const renderLoader = () => {
        return loadingScroll ? <Loading /> : null
    }

    const loadMore = () => {
        if (hasNextPage) {
            setLoadingScroll(true)
            getMyClients({ variables: { after: endCursor, before: '' } })
        }
    }

    const reloadApp = () => {
        setLoadingApp(true)
        getMyClients({ variables: { after: '', before: '' } })
    }

    const doRefresh = () => {
        setRefreshing(true)
        getMyClients({ variables: { after: '', before: '' } })
    }

    if (loadingApp) return <Loading />

    return (
        <View style={{ flex: 1 }}>
            {errorMyClients ?
                (
                    <NetworkError accion={reloadApp} />
                ) : (
                    <ClientsList
                        navigation={navigation}
                        clients_list={myClients}
                        doRefresh={doRefresh}
                        loadMore={loadMore}
                        renderLoader={renderLoader}
                        refreshing={refreshing}
                    />
                )}
        </View>
    )
}

export default ClientsScreen