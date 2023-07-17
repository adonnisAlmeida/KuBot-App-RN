import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { Typography } from '../../../components'
import { useTheme } from '@react-navigation/native'
import Colors from '../../../constants/Colors'
import AcceptShippingItem from './AcceptShippingItem'
import { useState } from 'react'

const AcceptShippingList = ({
    navigation,
    orders_list,
    doRefresh,
    loadMore,
    renderLoader,
    refreshing
}) => {
    const { colors } = useTheme()

    const onPressMessengerOrders = (order) => {
        if (order) {
            navigation.navigate('AcceptShippingDetailsScreen', {
                order_id: order.id,
            })
        }
    }

    const onRefresh = () => {
        doRefresh()
    }

    return (
        <View style={{ flex: 1 }}>
            {orders_list.length === 0 ? (
                <View
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 15, }}
                >
                    <Typography bold h3 color={colors.ON_BACKGROUND}>
                        No se encontraron pedidos para enviar.
                    </Typography>
                    <Typography color={colors.ON_BACKGROUND}>
                        Los pedidos aparecerán aquí después de que los clientes finalicen el proceso de pago.
                    </Typography>
                </View>
            ) : (
                <View>
                    <FlatList
                        style={styles.constains}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={renderLoader}
                        showsVerticalScrollIndicator={false}
                        data={orders_list}
                        refreshControl={
                            <RefreshControl
                                colors={[Colors.COLORS.PRIMARY]}
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        renderItem={({ item, index, separators }) => (
                            <AcceptShippingItem
                                onPress={() => onPressMessengerOrders(item)}
                                select_order={item}
                                navigation={navigation}
                                key={index}
                            />
                        )}
                    />
                </View>
            )}
        </View>
    )
}

export default AcceptShippingList

const styles = StyleSheet.create({
    constains: {
        ///marginTop: -12,
        //margin: 12,
        //paddingVertical: 18,
        paddingHorizontal: 18,
    },
})