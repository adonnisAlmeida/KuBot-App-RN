import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native'
import { Typography } from '../../../components'
import Ionicons from 'react-native-vector-icons/Ionicons'


const CustomPicker = ({ selectedValue, onValueChange, setInvalidMun, values, ...props }) => {
    const [visible, setVisible] = useState(false)
    const [badValue, setBadValue] = useState(false)

    const changeSelected = (item, index) => {
        onValueChange(item, index)
        setInvalidMun(false)
        setVisible(false)
    }

    useEffect(() => {
        const elements = values?.filter((mun) => mun.node.name.toUpperCase() == selectedValue.toUpperCase())
        if (elements.length == 0) {// no existe la provincia
            setBadValue(selectedValue)
            setInvalidMun(true)
        }
    }, [])

    return (
        <>
            <TouchableOpacity
                style={[
                    styles.mainView,
                    props.style,
                ]}
                onPress={() => setVisible(true)}
            >
                <Typography style={{
                    textDecorationLine: selectedValue == badValue ? 'line-through' : 'none'
                }} size={16}>{selectedValue}</Typography>
                <Ionicons
                    style={{ marginRight: 17 }}
                    name='md-caret-down-sharp'
                    size={13}
                    color='#8E8E8E'
                />
            </TouchableOpacity>
            <Modal
                visible={visible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                //onPressOut={() => setVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <ScrollView
                            style={{ padding: 10 }}
                        >
                            {values?.map((item, index) => {
                                return (
                                    <TouchableOpacity key={index} onPress={() => changeSelected(item, index)} style={styles.selectElement}>
                                        <Typography size={16}>{item.node.name}</Typography>
                                    </TouchableOpacity>
                                )
                            })}
                            {badValue ? (
                                <TouchableOpacity key={values?.length + 1}  style={styles.selectElement}>
                                    <Typography style={{textDecorationLine: 'line-through'}} size={16}>{badValue}</Typography>
                                </TouchableOpacity>
                            ) : ''}

                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    mainView: {
        //backgroundColor: 'red',
        height: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        height: 52,
        alignContent: 'center',
        alignItems: 'center',
        paddingLeft: 3,
        /* borderBottomColor: '#8E8E8E',
        borderBottomWidth: StyleSheet.hairlineWidth, */
    },
    selectElement: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        //backgroundColor: 'red'
    },
    modalContent: {
        marginVertical: 15,
        width: '88%',
        backgroundColor: '#fff',
        borderRadius: 4,
    },
})

export default CustomPicker