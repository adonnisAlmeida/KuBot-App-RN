import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Typography } from '../../../components'
import Colors from '../../../constants/Colors'

const DeliveryAreaItem = ({ deliveryArea, no_title }) => {
    return (
        no_title == true ? (
            <View style={{paddingVertical: 4, paddingLeft: 8, marginLeft: 12}}>
                <Typography size={16}>{deliveryArea.node.name}</Typography>
            </View>
        ) : (
            <>
                {deliveryArea.node.parent ?
                    (
                        <View style={{paddingVertical: 4}}>
                            <Typography style={{backgroundColor: Colors.COLORS.WEB_START_OFF, padding: 2, paddingHorizontal: 12}} size={16} bold>{deliveryArea.node.parent.name}</Typography>
                            <View style={{paddingVertical: 4, paddingLeft: 8, marginLeft: 12}}>
                                <Typography size={16}>{deliveryArea.node.name}</Typography>
                            </View>
                        </View>
                    ) : (
                        <View style={{paddingVertical: 8}}>
                            <Typography size={16} style={{marginBottom: 4, backgroundColor: Colors.COLORS.WEB_START_OFF, padding: 2, paddingHorizontal: 12}} bold>{deliveryArea.node.name}</Typography>
                            <Typography small style={{marginLeft: 12, marginTop: 2}}>"Todos los municipios"</Typography>
                        </View>
                    )
                }
            </>
        )
    )
}

const styles = StyleSheet.create({
    mainContent: {
        paddingVertical: 8,
        //marginHorizontal: 5,
        /* borderBottomWidth: 1,
        borderBottomColor: Colors.COLORS.ON_SURFACE, */
    }
})

export default DeliveryAreaItem