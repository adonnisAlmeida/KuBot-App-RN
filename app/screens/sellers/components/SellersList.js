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

const SellersList = ({ navigation, sellers_list, doRefresh, refreshing }) => {
    const { colors } = useTheme()

    const onRefresh = () => {
		doRefresh()
	}

    //console.log("PREUBAAA >> ", sellers_list[0].user.avatar)
    console.log(sellers_list.length)

    return (
        <TouchableWithoutFeedback>
            <View style={{ flex: 1 }}>
                {sellers_list.length === 0 ? (
                    <View
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Typography color={colors.ON_BACKGROUND}>
                            No hay Vendedores para mostrar
                        </Typography>
                    </View>
                ) : (
                    <View>
                        <FlatList
                            style={styles.constains}
                            showsVerticalScrollIndicator={false}
                            data={sellers_list}
                            refreshControl={
								<RefreshControl
									colors={[Colors.COLORS.PRIMARY]}
									refreshing={refreshing}
									onRefresh={onRefresh}
								/>
							}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index, separators }) => (
                                <SellerItem
                                    seller={item}
                                    navigation={navigation}
                                    key={index}
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