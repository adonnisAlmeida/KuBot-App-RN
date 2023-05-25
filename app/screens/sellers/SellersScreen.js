import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SellersList from './components/SellersList'
import { useLazyQuery } from '@apollo/client'
import { ORDERS_LIST_SELLERS } from '../../graphql/clients'
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

    const [getSellers, { loading, error, data }] = useLazyQuery(ORDERS_LIST_SELLERS, {
        onCompleted: (data) => {
            const ordenes = data.orders.edges
            /* const groupedItems = ordenes.reduce((results, item) => {
                item.node.sellers.forEach((seller) => {
                    if (seller !== null) {
                        (results[seller.id] = results[seller.id] || []).push(seller)
                    }
                })
                return results
            }, {}) */
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
            console.log("IDDDD >>> ", temp[0].user.id)
            console.log("IDDDD >>> ", temp)
            dispatch(setSellersByUser(temp))
            //setMySellers(temp)
            setLoadingApp(false)
            setRefreshing(false)

            /* const propertyValues = Object.values(groupedItems)
            dispatch(setSellersByUser(propertyValues))
            setMySellers(propertyValues)
            setLoadingApp(false) */
        },
        onError: () => {
            setLoadingApp(false)
            setRefreshing(false)
            console.log('ERROR CARGANDO SELLERS')
        },
        fetchPolicy: "no-cache"
    })

    useEffect(() => {
        getSellers({ variables: { carrier: carrierID } })
    }, [])

    useEffect(() => {
        setMySellers(sellersStore.sellers)
    }, [sellersStore.sellers])

    const reloadApp = () => {
        setLoadingApp(true)
        getSellers({ variables: { carrier: carrierID } })
    }

    const doRefresh = () => {
        setRefreshing(true)
        getSellers({ variables: { carrier: carrierID } })
    }


    setTimeout(() => {
        if (loadingApp) setLoadingApp(false)
    }, 2000)

    if (loadingApp) return <Loading />
    if (loading && mySellers.length === 0 ) return <Loading />

    console.log(mySellers.length)

    return (
        <View style={{ flex: 1 }}>
            {error ?
                (
                    <NetworkError accion={reloadApp} />
                ) : (
                    <SellersList
                        navigation={navigation}
                        sellers_list={mySellers}
                        doRefresh={doRefresh}
                        refreshing={refreshing}
                    />
                    /* mySellers.length != 0 ? (
                        mySellers.map(e => (
                            <Text>ID >> {e.user.id}</Text>
                        ))
                    ) :
                        (
                            <Text>Est es una prueba</Text>
                        ) */
                )}
        </View>
    )
}

export default SellersScreen