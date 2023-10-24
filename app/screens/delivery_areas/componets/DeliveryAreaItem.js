import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Typography } from '../../../components'
import Colors from '../../../constants/Colors'

const DeliveryAreaItem = ({ deliveryArea }) => {
    console.log(deliveryArea)
    return (
        <View style={styles.mainContent}>
            {deliveryArea.node.parent ?
                (
                    <>
                        <Typography bold>{deliveryArea.node.parent.name}</Typography>
                        <Typography>{deliveryArea.node.name}</Typography>
                    </>
                ) : (
                    <Typography bold>{deliveryArea.node.name}</Typography>
                )}
        </View>
    )
}

const styles = StyleSheet.create({
    mainContent: {
        paddingVertical: 15,
        marginHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: Colors.COLORS.ON_SURFACE,
    }
})

export default DeliveryAreaItem