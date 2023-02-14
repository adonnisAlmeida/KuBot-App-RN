import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import moment from 'moment'
import { useTheme } from '@react-navigation/native'
import { pagoAmigable } from '../../../../utils/CommonFunctions'
import { Typography } from '../../../../components'
moment.locale('es')

const PaymentNavView = ({ navigation, route }) => {
  const { colors } = useTheme()
  let data = route.params?.data
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {data.order.payments.length > 0 && (<View>
        <View style={{ paddingBottom: 32 }}>
          {data.order.payments.map((payment, index) => {
            return (
              <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
                <Typography color={colors.ON_SURFACE}>
                  <Typography bold color={colors.ON_SURFACE}>
                    Fecha:
                  </Typography>{' '}
                  {moment(payment.created).format('YYYY-MM-DD')}
                </Typography>
                <Typography color={colors.ON_SURFACE}>
                  <Typography bold color={colors.ON_SURFACE}>
                    Estado del Pago:
                  </Typography>{' '}
                  {pagoAmigable(payment.chargeStatus)}
                </Typography>
                <Typography color={colors.ON_SURFACE}>
                  <Typography bold color={colors.ON_SURFACE}>
                    Cantidad:
                  </Typography>{' '}
                  {payment.total.amount} {payment.total.currency}
                </Typography>
              </View>
            )
          })}
        </View>
      </View>)}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  myCard: {
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
    borderRadius: 5,
  },
})

export default PaymentNavView