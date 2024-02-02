import { View, Text } from 'react-native'
import React from 'react'
import { Typography } from '../../../../../components'
import Colors from '../../../../../constants/Colors'

const PaymentInfo = () => {
    return (
        <View style={{
            padding: 10,
            backgroundColor: Colors.COLORS.INFO,
            borderBottomWidth: 1,
            borderBottomColor: 'rgb(90,90,90)',
        }}>
            <Typography bold size={18} >A tener en cuenta</Typography>
            <Typography size={16} >Debe cobrar al entregar el paquete, orden de pago contra reembolso.</Typography>
            <Typography size={16} >Es IMPORTANTE verificar que el número de carné de identidad del comprador coincide con el del destinatario del pedido.</Typography>
        </View>
    )
}

export default PaymentInfo