import { View, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Typography } from '../../../components'
import { count_elementos_str } from '../../../utils/CommonFunctions'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useState } from 'react'
import MunicipioComponet from './MunicipioComponet'
import ProvinciaElement from './ProvinciaElement'

const ProvinciaComponet = ({ provincia, selectedMun, setSelectedMun }) => {
    const [openDrop, setOpenDrop] = useState(false)

    const handleOpen = () => {
        setOpenDrop(!openDrop)
    }

    return (
        <>
            <TouchableOpacity
                style={styles.mainComponet}
                onPress={() => handleOpen()}
            >
                <Typography
                    color='#000'
                >
                    {provincia.name} {count_elementos_str(provincia.municipios.length)}
                </Typography>
                {openDrop ? (
                    <FontAwesome
                        active={false}
                        name="chevron-up"
                        color='#000'
                        size={16}
                    />
                ) : (
                    <FontAwesome
                        active={false}
                        name="chevron-down"
                        color='#000'
                        size={16}
                    />
                )}
            </TouchableOpacity>
            {openDrop ? (
                <View style={styles.provinciasContent}>
                    {/* <MunicipioComponet
                        key={provincia.id}
                        municipio={
                            {node: {
                                id: provincia.id,
                                name: "Provincia de " + provincia.name
                            }}
                        }
                        selectedMun={selectedMun}
                        setSelectedMun={setSelectedMun}
                    /> */}
                    <ProvinciaElement
                        key={provincia.id}
                        provinciaId={provincia.id}
                        name={provincia.name}
                        serverId={provincia.serverId}
                        selectedMun={selectedMun}
                        setSelectedMun={setSelectedMun}
                    />
                    {provincia.municipios.map((municipio, index) => {
                        return (
                            <MunicipioComponet
                                key={municipio.node.id}
                                municipio={municipio}
                                selectedMun={selectedMun}
                                setSelectedMun={setSelectedMun}
                            />
                        )
                    })}
                </View>
            ) : (
                null
            )}
        </>
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
        paddingVertical: 12,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1.5 },
        shadowRadius: 8,
        elevation: 1
    },
    provinciasContent: {
        marginLeft: 28,
        overflow: 'hidden',
    },
})

export default ProvinciaComponet