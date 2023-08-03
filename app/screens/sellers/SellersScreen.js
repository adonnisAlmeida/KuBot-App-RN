import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SellersList from './components/SellersList'
import { useLazyQuery } from '@apollo/client'
import { MY_SELLERS, ORDERS_LIST_SELLERS } from '../../graphql/clients'
import { getSellersByUser, setSellersByUser } from '../../redux/sellers/sellersSlice'
import { useEffect } from 'react'
import { Loading, NetworkError } from '../../components'


const SellersScreen = ({ navigation }) => {
    const [loadingApp, setLoadingApp] = useState(false)
    const [mySellers, setMySellers] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const dispatch = useDispatch()
    const sellersStore = useSelector(state => state.sellers)
    const userStore = useSelector(state => state.userlogin)
    const carrierID = userStore.carrierInfo.serverId;
    const [loadingScroll, setLoadingScroll] = useState(false)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [endCursor, setEndCursor] = useState("")

    const [getSellers, { loading, error, data }] = useLazyQuery(ORDERS_LIST_SELLERS, {
        onCompleted: (data) => {
            const ordenes = data.orders.edges
            let temp = []
            ordenes.forEach(el => {
                el.node.sellers.forEach(use => {
                    if (temp.filter(e => e.user.id === use.user.id).length > 0) {
                        return
                    } else {
                        temp.push(use)
                    }
                })
            })
            dispatch(setSellersByUser(temp))
            setMySellers(temp)
            setLoadingApp(false)
            setRefreshing(false)

        },
        onError: () => {
            setLoadingApp(false)
            setRefreshing(false)
            console.log('ERROR CARGANDO SELLERS')
        },
        fetchPolicy: "no-cache"
    })

    const [getMySellers, { loadingMySellers, errorMySellers, dataMySellers }] = useLazyQuery(MY_SELLERS, {
        onCompleted: (dataMySellers) => {
            if (dataMySellers.mySellers.pageInfo.hasNextPage) {
                setHasNextPage(dataMySellers.mySellers.pageInfo.hasNextPage)
                setEndCursor(dataMySellers.mySellers.pageInfo.endCursor)
            } else {
                setHasNextPage(false)
            }
            if (loadingApp || refreshing) {
                let elementos = []
                dataMySellers.mySellers.edges.map((edges) => elementos.push(edges.node))
                setMySellers(elementos)
                dispatch(setSellersByUser(elementos))
            } else {
                let elementos = []
                dataMySellers.mySellers.edges.map((edges) => elementos.push(edges.node))
                setMySellers([...mySellers, ...elementos])
                dispatch(setSellersByUser([...mySellers, ...elementos]))
            }
            setLoadingApp(false)
            setRefreshing(false)
            setLoadingScroll(false)
        },
        onError: (errorMySellers) => {
            setLoadingApp(false)
            setRefreshing(false)
            console.log('Error cargando lista de clientes ', errorMySellers)
        },
        fetchPolicy: "no-cache"
    })

    useEffect(() => {
        setLoadingApp(true)
        //getSellers({ variables: { carrier: carrierID } })
        getMySellers({ variables: { after: '', before: '' } })
    }, [])

    const renderLoader = () => {
        return loadingScroll ? <Loading /> : null
    }

    const loadMore = () => {
        if (hasNextPage) {
            setLoadingScroll(true)
            getMySellers({ variables: { after: endCursor, before: '' } })
        }
    }

    const reloadApp = () => {
        setLoadingApp(true)
        getMySellers({ variables: { after: '', before: '' } })
    }

    const doRefresh = () => {
        setRefreshing(true)
        getMySellers({ variables: { after: '', before: '' } })
    }

    if (loadingApp) return <Loading />

    return (
        <View style={{ flex: 1 }}>
            {errorMySellers ?
                (
                    <NetworkError accion={reloadApp} />
                ) : (
                    <SellersList
                        navigation={navigation}
                        sellers_list={mySellers}
                        doRefresh={doRefresh}
                        refreshing={refreshing}
                        loadMore={loadMore}
                        renderLoader={renderLoader}
                    />
                )}
        </View>
    )
}

export default SellersScreen