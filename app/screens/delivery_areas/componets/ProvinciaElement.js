import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Typography } from '../../../components'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Colors from '../../../constants/Colors'

const ProvinciaElement = ({ provinciaId, serverId, name, selectedMun, setSelectedMun }) => {

    const isSelected = () => {
        if (selectedMun.filter(mun => mun.node.id === provinciaId).length > 0) {
            return (
                <FontAwesome
                    name="check"
                    color={Colors.COLORS.PRIMARY}
                    size={20}
                />
            )
        }
    }

    const handleMunPress = () => {
        if (selectedMun.filter(mun => mun.node.id === provinciaId).length > 0) {
            setSelectedMun((prevMuns) => prevMuns.filter(mun => mun.node.id != provinciaId))
        } else (
            setSelectedMun([...selectedMun, { node: { id: provinciaId, name: name, serverId: serverId } }])
        )
    }
    return (
        <TouchableOpacity
            style={styles.mainComponet}
            onPress={() => handleMunPress()}
        >
            <View style={{ flexDirection: 'row' }}>
                <Typography>{name} </Typography>
                <Typography
                    light
                    color='#000'
                >
                    (Provincia)
                </Typography>
            </View>

            {isSelected()}

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainComponet: {
        backgroundColor: '#fff',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: 'transparent',
        borderRadius: 8,
        marginVertical: 5,
        paddingVertical: 10,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1.5 },
        shadowRadius: 8,
        elevation: 1
    },
})

export default ProvinciaElement