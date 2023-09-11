import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Typography } from '../../../../components'
import { useTheme } from '@react-navigation/native'
import moment from 'moment'
import { currencySimbol, pagoAmigable } from '../../../../utils/CommonFunctions'
import Colors from '../../../../constants/Colors'
moment.locale('es')

const ProductsNavView = ({ navigation, route }) => {
    let data = route.params?.data
    const d = new Date(data.orderById.created);
    const { colors } = useTheme()

    const calculateTotal = (amount, quantity) => {
        return parseFloat(amount * quantity).toFixed(2)
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            {data.orderById.lines.map((producto, index) => {
                return (
                    <View key={index} style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                        <Typography color={colors.ON_SURFACE}>
                            <Typography bold color={colors.ON_SURFACE}>
                                Nombre:
                            </Typography>{' '}
                            {producto.productName} {producto.variant.name && "("+producto.variant.name+")"}
                        </Typography>

                        <Typography color={colors.ON_SURFACE}>
                            <Typography bold color={colors.ON_SURFACE}>
                                SKU:
                            </Typography>{' '}
                            {producto.productSku}
                        </Typography>

                        <Typography color={colors.ON_SURFACE}>
                            <Typography bold color={colors.ON_SURFACE}>
                                Cantidad:
                            </Typography>{' '}
                            {producto.quantity}
                        </Typography>
                    </View>

                )
            })}
            <Typography></Typography>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    priceRow: {
        paddingLeft: 10
    },
    quantityRow: {
        paddingHorizontal: 12
    },
    totalRow: {
        paddingLeft: 10
    },
    tableColumn: {
        marginLeft: 10,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.COLORS.ACTIVE_DARKMODE,
    },
    tableLeftRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    tableHeader: {

    },
    table: {
        marginTop: 10,
    },
    myCard: {
        borderRadius: 5,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        padding: 15,
        elevation: 4,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        flexDirection: 'column',
        borderColor: 'transparent',
        borderRadius: 8,
        marginVertical: 5,
        padding: 18,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1.5 },
        shadowRadius: 8,
    },
    avatar: {
        alignSelf: 'center',
        width: 124,
        height: 124,
        borderRadius: 50,
        borderWidth: 0,
    },
})

export default ProductsNavView