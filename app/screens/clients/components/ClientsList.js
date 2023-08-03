import {
    View, StyleSheet,
    FlatList,
    TouchableWithoutFeedback,
    RefreshControl,
} from 'react-native'
import React, { useState } from 'react'
import { Typography } from '../../../components'
import { useTheme } from '@react-navigation/native'
import ClientItem from './ClientItem'
import Colors from '../../../constants/Colors'

const ClientsList = ({ navigation, clients_list, doRefresh, loadMore, renderLoader, refreshing }) => {
    const { colors } = useTheme()

    const onRefresh = () => {
        doRefresh()
    }

    return (
        <TouchableWithoutFeedback>
            <View style={{ flex: 1 }}>
                {clients_list.length === 0 ? (
                    <View
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 15 }}
                    >
                        <Typography bold h3 color={colors.ON_BACKGROUND}>
                            No se encontraron clientes.
                        </Typography>
                        <Typography color={colors.ON_BACKGROUND}>
                            Las cuentas de clientes aparecerán aquí una vez que los usuarios se registren en la tienda.
                        </Typography>
                    </View>
                ) : (
                    <View>
                        <FlatList
                            style={styles.constains}
                            showsVerticalScrollIndicator={false}
                            data={clients_list}
                            ListFooterComponent={renderLoader}
                            onEndReached={loadMore}
                            onEndReachedThreshold={0.5}
                            refreshControl={
                                <RefreshControl
                                    colors={[Colors.COLORS.PRIMARY]}
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                />
                            }
                            renderItem={({ item }) => (
                                <ClientItem
                                    client={item}
                                    navigation={navigation}
                                    key={item.id}
                                />
                            )}
                        />
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    )
}

export default ClientsList

const styles = StyleSheet.create({
    constains: {
        /* marginTop: -12,
        margin: 12,
        paddingVertical: 18, */
        paddingHorizontal: 18,
    },
})