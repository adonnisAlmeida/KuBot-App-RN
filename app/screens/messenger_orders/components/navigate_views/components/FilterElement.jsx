import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Typography } from '../../../../../components'
import Colors from '../../../../../constants/Colors'
import Ionicons from 'react-native-vector-icons/Ionicons'

const FilterElement = ({ content, pressedFilter }) => {
    return (
        <TouchableOpacity
            style={{
                backgroundColor: '#efefef',
                padding: 7,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.COLORS.WEB_LINK,
                marginRight: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}
            onPress={() => pressedFilter()}
        >
            <Typography bold color={Colors.COLORS.WEB_LINK}>{content}</Typography>
            <Ionicons
                style={{marginLeft: 5}}
                name='chevron-down-circle'
                color={Colors.COLORS.WEB_LINK}
                size={20}
            />
        </TouchableOpacity>
    )
}

export default FilterElement
