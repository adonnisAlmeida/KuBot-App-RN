import { View, Text, StyleSheet, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { Typography } from '../../components'
import { TimePickerInputLineal, DatePickerInputLineal } from '../../components/DatePickerInput'
import MySelect from '../../components/MySelect'
import { useEffect } from 'react'
import Colors from '../../constants/Colors'
import { printCreated, stringToColour } from '../../utils/CommonFunctions'

const localRules = [
    {
        "id": "UnVsZTox",
        "name": "Yearly",
        "nameSpanish": "Anualmente",
        "label": "Anualmente",
        "description": "Repeat yearly",
        "frequency": "YEARLY",
        "serverId": 1,
        "value": 1
    },
    {
        "id": "UnVsZToy",
        "name": "Monthly",
        "nameSpanish": "Mensualmente",
        "label": "Mensualmente",
        "description": "Repeat monthly",
        "frequency": "MONTHLY",
        "serverId": 2,
        "value": 2
    },
    {
        "id": "UnVsZToz",
        "name": "Weekly",
        "nameSpanish": "Semanalmente",
        "label": "Semanalmente",
        "description": "Repeat weekly",
        "frequency": "WEEKLY",
        "serverId": 3,
        "value": 3
    },
    {
        "id": "UnVsZTo0",
        "name": "Daily",
        "nameSpanish": "A diario",
        "label": "A diario",
        "description": "Repeat daily",
        "frequency": "DAILY",
        "serverId": 4,
        "value": 4
    },
    {
        "id": "UnVsZrg0",
        "name": "Never",
        "nameSpanish": "Única vez",
        "label": "Única vez",
        "description": "Repeat never",
        "frequency": "NEVER",
        "serverId": 5,
        "value": 5
    },
]

const Pruebas = () => {
    const [selectedRule, setSelectedRule] = useState(5)
    const [item, setItem] = useState({
        "id": "UnVsZrg0",
        "name": "Never",
        "nameSpanish": "Única vez",
        "label": "Única vez",
        "description": "Repeat never",
        "frequency": "NEVER",
        "serverId": 5,
        "value": 5
    })
    const [finFull, setFinFull] = useState(null)
    const [fin, setFin] = useState('')
    const [inicioFull, setInicioFull] = useState(null)
    const [inicio, setInicio] = useState('')
    const [fechaFin, setFechaFin] = useState('')
    const [barStyle, setBarStyle] = useState('light-content')

    useEffect(() => {
        switch (item.serverId) {
            case 1:
                setBarStyle('dark-content')
                break;
            case 2:
                setBarStyle('light-content')
                break;
            case 3:
                setBarStyle('light-content')
                break;
            case 4:
                setBarStyle('dark-content')
                break;
            case 5:
                setBarStyle('dark-content')
                break;
        }
    }, [item])

    return (
        <>
            {/* <StatusBar
                backgroundColor={
                    stringToColour(item.name) + '99'
                }
                barStyle={barStyle}
            /> */}
            <View style={{ flex: 1 }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: '#fff',
                    paddingHorizontal: 16,
                    paddingVertical: 20,
                }}>
                    <Typography>
                        Desde
                    </Typography>
                    <Typography>
                        {printCreated('2023-04-03')}
                    </Typography>
                </View>
                <View style={{
                    backgroundColor: '#fff',
                    marginTop: 15,
                    paddingHorizontal: 16,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: 10,
                    }}>
                        <TimePickerInputLineal
                            label="Hora de Inicio"
                            date={inicioFull}
                            value={inicio}
                            setValue={setInicio}
                        />
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: 10,
                        borderTopColor: '#8E8E8E',
                        borderTopWidth: StyleSheet.hairlineWidth,
                    }}>
                        <TimePickerInputLineal
                            date={finFull}
                            label="Hora de Fin"
                            value={fin}
                            setValue={setFin}
                        />
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: 10,
                        borderTopColor: '#8E8E8E',
                        borderTopWidth: StyleSheet.hairlineWidth,
                    }}>
                        <MySelect
                            label="Repetir"
                            items={localRules}
                            value={selectedRule}
                            setValue={setSelectedRule}
                            setItem={setItem}
                        />
                    </View>
                    {selectedRule != 5 ? (
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingVertical: 10,
                            borderTopColor: '#8E8E8E',
                            borderTopWidth: StyleSheet.hairlineWidth,
                        }}>
                            <DatePickerInputLineal
                                label="Fecha de Finalización"
                                value={fechaFin}
                                setValue={setFechaFin}
                                type='date'
                                date={fechaFin}
                            />
                        </View>
                    ) : null}
                </View>
            </View>
        </>

    )
}


export default Pruebas