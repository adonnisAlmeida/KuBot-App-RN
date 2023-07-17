import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Typography } from '../../../components'
import { useDispatch, useSelector } from 'react-redux'
import { deliveryAreasIds, listado } from '../../../redux/deliveryareas/deliveryareasSlice'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Colors from '../../../constants/Colors'

const MunicipioComponet = ({ municipio, selectedMun, setSelectedMun }) => {
    const isSelected = () => {
        if (selectedMun.filter(mun => mun.node.id === municipio.node.id).length > 0) {
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
        if (selectedMun.filter(mun => mun.node.id === municipio.node.id).length > 0) {
            setSelectedMun((prevMuns) => prevMuns.filter(mun => mun.node.id != municipio.node.id))
        }else(
            setSelectedMun([...selectedMun, municipio])
        )
    }

    return (
        <TouchableOpacity
            style={styles.mainComponet}
            onPress={() => handleMunPress()}
        >
            <Typography>{municipio.node.name}</Typography>
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

export default MunicipioComponet