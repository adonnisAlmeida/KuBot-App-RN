import { View, Text, ScrollView, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@react-navigation/native'
import { Typography } from '../../../../components'
import moment from 'moment'
import Colors from '../../../../constants/Colors'
import { historialAmigable } from '../../../../utils/CommonFunctions'

const HistoryNavView = ({ navigation, route }) => {
  const { colors } = useTheme()
  const [events, setEvents] = useState([])
  let data = route.params?.data
  useEffect(() => {
    let tempEvents = []
    data.orderById.events.map((event, index) => {
      tempEvents.push(event)
    })
    setEvents(tempEvents.reverse())
  }, [])
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={[styles.myCard, { backgroundColor: colors.SURFACE }]}>
        {events.length !== 0 ?
          events.map((event, index) => {
            return (
              <View style={styles.histContainer} key={index}>
                <View>
                  <View style={styles.histCircle}>
                  </View>
                  <View style={styles.histLine}>
                  </View>
                </View>
                <View style={styles.histText}>
                  <Typography color={colors.ON_SURFACE}>
                    {moment(event.date).format('YYYY-MM-DD HH:mm')}
                  </Typography>
                  <Typography color={colors.ON_SURFACE}>
                    {historialAmigable(event.type)?.ES}
                  </Typography>
                </View>
              </View>
            )
          }) :
          (
            <Typography color={colors.ON_SURFACE}>
              Orden sin Historial
            </Typography>
          )}
      </View>
      <Typography></Typography>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  histLine: {
    borderLeftWidth: 2,
    flex: 1,
    marginLeft: 7,
    borderColor: Colors.COLORS.PRIMARY,
  },
  histCircle: {
    borderWidth: 2,
    borderRadius: 100,
    borderColor: Colors.COLORS.PRIMARY,
    width: 15,
    height: 15,
  },
  histText: {
    paddingBottom: 15,
    marginLeft: 8,
  },
  histContainer: {
    flexDirection: 'row'
  },
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


export default HistoryNavView