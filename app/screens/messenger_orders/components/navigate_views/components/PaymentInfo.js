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
            <Typography size={16} >Debe cobrar al entregar el paquete, orden de pago contra reembolso.</Typography>
        </View>
    )
}

export default PaymentInfo