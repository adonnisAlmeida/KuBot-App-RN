import {
    View, Text, StyleSheet,
    FlatList,
    TouchableWithoutFeedback,
    RefreshControl,
} from 'react-native'
import React, { useState } from 'react'
import { Typography } from '../../../components'
import { useTheme } from '@react-navigation/native'
import SellerItem from './SellerItem'
import Colors from '../../../constants/Colors'

const SellersList = ({ navigation, sellers_list, doRefresh, refreshing, loadMore, renderLoader }) => {
    const { colors } = useTheme()

    const onRefresh = () => {
		doRefresh()
	}

    //console.log("PREUBAAA >> ", sellers_list[0].user.avatar)
    //console.log(sellers_list.length)

    return (
        <TouchableWithoutFeedback>
            <View style={{ flex: 1 }}>
                {sellers_list.length === 0 ? (
                    <View
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 15 }}
                    >
                        <Typography bold h3 color={colors.ON_BACKGROUND}>
                            No se encontraron vendedores.
                        </Typography>
                        <Typography color={colors.ON_BACKGROUND}>
                            Las cuentas de vendedores aparecerán aquí una vez que los usuarios se registren en la tienda.
                        </Typography>
                    </View>
                ) : (
                    <View>
                        <FlatList
                            style={styles.constains}
                            showsVerticalScrollIndicator={false}
                            data={sellers_list}
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
                            renderItem={({ item, index, separators }) => (
                                <SellerItem
                                    seller={item}
                                    navigation={navigation}
                                    key={item.serverId}
                                />
                            )}
                        />
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    )
}

export default SellersList

const styles = StyleSheet.create({
    constains: {
        /* marginTop: -12,
        margin: 12,
        paddingVertical: 18, */
        paddingHorizontal: 18,
    },
})