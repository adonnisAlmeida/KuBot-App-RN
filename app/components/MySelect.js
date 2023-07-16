import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import Typography from './Typography'
import { stringToColour } from '../utils/CommonFunctions'

const MySelect = ({ label, items, value, setItem, setValue, ...props }) => {
    /* const [items, setItems] = useState(items)
    const [value, setValue] = useState(value) */
    const [selectedLabel, setSelectedLabel] = useState(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        let result = items.find(obj => obj.serverId === value);
        setSelectedLabel(result)
        setItem(result)
    }, [value])

    const changeSelected = (item, index) => {
        setValue(item.serverId)
        setSelectedLabel(item)
        setVisible(false)
    }

    return (
        <>
            <TouchableOpacity
                style={[
                    {
                        //backgroundColor: 'red',
                        height: 20,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        flex: 1,
                        height: 40,
                        alignContent: 'center',
                        alignItems: 'center',
                    },
                    props.style,
                ]}
                onPress={() => setVisible(true)}
            >
                {label ? (
                    <Typography>{label}</Typography>
                ) : (
                    <Typography></Typography>
                )}
                <View style={[
                    {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignContent: 'center',
                        alignItems: 'center',
                    },
                ]}>
                    <View style={{
                        height: 10,
                        width: 10,
                        borderRadius: 100,
                        backgroundColor: selectedLabel? stringToColour(selectedLabel?.name) + '99' : 'transparent',
                        marginRight: 10
                    }} />
                    <Typography>{selectedLabel?.label}</Typography>
                </View>
            </TouchableOpacity>
            <Modal
                visible={visible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPressOut={() => setVisible(false)}
                >
                    <View style={styles.modalContent}>
                        {items.map((item, index) => {
                            return (
                                <TouchableOpacity key={item.id? item.id : index} onPress={() => changeSelected(item, index)} style={styles.selectElement}>
                                    <Typography size={16}>{item.nameSpanish}</Typography>
                                </TouchableOpacity>
                            )
                            //return <Picker.Item key={index} themeVariant={'dark'} label={item.nameSpanish} value={item.serverId} />
                        })}
                        {/* <TouchableOpacity style={styles.selectElement}><Typography>Elemento 1</Typography></TouchableOpacity>
                        <TouchableOpacity style={styles.selectElement}><Typography>Elemento 2</Typography></TouchableOpacity>
                        <TouchableOpacity style={styles.selectElement}><Typography>Elemento 3</Typography></TouchableOpacity> */}
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    selectElement: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        //backgroundColor: 'red'
    },
    modalContent: {
        //alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        width: '80%',
        /* height: 100, */
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowColor: '#000000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 8,
    },
})

export default MySelect