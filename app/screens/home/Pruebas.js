import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Typography } from '../../components'
import PushNotification, { Importance } from "react-native-push-notification";
import Pushy from 'pushy-react-native';
import Colors from '../../constants/Colors';

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

const Pruebas = ({ navigation }) => {
    const [canales, setCanales] = useState([])

    useEffect(() => {
        PushNotification.getChannels(function (channel_ids) {
            setCanales(channel_ids)
        });
    }, [])

    const actualizar_canales = () => {
        PushNotification.getChannels(function (channel_ids) {
            setCanales(channel_ids)
        });
    }

    const crear_canal = () => {
        PushNotification.createChannel(
            {
                channelId: "prueba-1", // (required)
                channelName: "prueba-1", // (required)
                soundName: "sample.mp3", // (optional) See `soundName` parameter of `localNotification` function
                importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
                vibrate: true,
            },
            (created) => console.log(`prueba-1 '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
        /* PushNotification.createChannel(
            {
                channelId: "default-channel-id", // (required)
                channelName: `Default channel`, // (required)
                channelDescription: "A default channel", // (optional) default: undefined.
                soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
                importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
                vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
            },
            (created) => console.log(`createChannel 'default-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
        PushNotification.createChannel(
            {
                channelId: "sound-channel-id", // (required)
                channelName: `Sound channel`, // (required)
                channelDescription: "A sound channel", // (optional) default: undefined.
                soundName: "sample.mp3", // (optional) See `soundName` parameter of `localNotification` function
                importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
                vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
            },
            (created) => console.log(`createChannel 'sound-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        ); */
        actualizar_canales()
    }

    const eliminar_canal = () => {
        PushNotification.getChannels(function (channel_ids) {
            channel_ids.forEach(chan => {
                PushNotification.deleteChannel(chan);
            })
        });
        actualizar_canales()
    }

    const notificacion1 = (notificacion) => {
        PushNotification.localNotification({
            channelId: 'KuBotApp-Channel',
            subText: notificacion.subText? notificacion.subText : "",
            title: notificacion.title,
            message: notificacion.message,
            color: Colors.COLORS.PRIMARY, // (optional) default: system default
            smallIcon: "ic_notification",
            data: notificacion
        });
    }

    const notificacion2 = (notificacion) => {
        PushNotification.localNotification({
            channelId: 'KuBotApp-Channel',
            subText: notificacion.subText? notificacion.subText : "",
            title: notificacion.title,
            message: notificacion.message,
            color: Colors.COLORS.PRIMARY, // (optional) default: system default
            smallIcon: "ic_notification",
            data: notificacion
        });
    }
    const notificacion3 = (notificacion) => {
        PushNotification.localNotification({
            channelId: 'KuBotApp-Channel',
            subText: notificacion.subText? notificacion.subText : "",
            title: notificacion.title,
            message: notificacion.message,
            color: Colors.COLORS.PRIMARY, // (optional) default: system default
            smallIcon: "ic_notification",
            data: notificacion
        });
    }
    
    const notificacion4 = (notificacion) => {
        PushNotification.localNotification({
            channelId: 'KuBotApp-Channel',
            subText: notificacion.subText? notificacion.subText : "",
            title: notificacion.title,
            message: notificacion.message,
            color: Colors.COLORS.PRIMARY, // (optional) default: system default
            smallIcon: "ic_notification",
            data: notificacion
        });
    }

    return (
        <View>
            <View>
                {
                    canales.map(can => {
                        return (
                            <View style={{ marginVertical: 20 }}>
                                <Typography>
                                    {can}
                                </Typography>
                            </View>
                        )
                    })
                }
            </View>

            <TouchableOpacity
                style={{
                    padding: 5,
                    backgroundColor: 'orange',
                    marginTop: 5
                }}
                onPress={() => crear_canal()}
            >
                <Typography>Crear Canal</Typography>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    padding: 5,
                    backgroundColor: 'orange',
                    marginTop: 5
                }}
                onPress={() => eliminar_canal()}
            >
                <Typography>Eliminar Canal</Typography>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    padding: 5,
                    backgroundColor: 'orange',
                    marginTop: 5
                }}
                onPress={() => notificacion1({
                    'title': 'Manolo Pascual',
                    'subText': 'Nuevo Mensaje',
                    'message': 'Hola manolito, como esta todo, ya el pedido #123 esta listo para enviar ',
                    'messageTitle': 'Contenido del mensaje',
                    'navigate': true, 
                    'navigateTo': 'messages', 
                    'authorId': 4,
                    'category': 'new_message',
                })}
            >
                <Typography>Notificacion de mensajes</Typography>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    padding: 5,
                    backgroundColor: 'orange',
                    marginTop: 5
                }}
                onPress={() => notificacion2({
                    'title': 'Orden Completada',
                    'message': 'El pedido # 48 está listo para que un mensajero lo tome',
                    'category': 'order_completed',
                })}
            >
                <Typography>Posible orden</Typography>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    padding: 5,
                    backgroundColor: 'orange',
                    marginTop: 5
                }}
                onPress={() => notificacion3({
                    'subText': 'Cambio de estado',
                    'title': 'Cambio de estado de envio de la orden # 48',
                    'message': 'El estado de envio de la # 48 ha cambiado a Recogido por el Mensajero',
                    'category': 'cambio_estado',
                    'order_id': 'T3JkZXI6NDg='
                })}
            >
                <Typography>Cambio de estado de la orden</Typography>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    padding: 5,
                    backgroundColor: 'orange',
                    marginTop: 5
                }}
                onPress={() => notificacion4({
                    'title': 'Cuenta de Mensajero Activada',
                    'message': 'Su solicitud de cuenta de mensajero ha sido aprobada',
                    'category': 'account_active',
                })}
            >
                <Typography>Cuenta de Mensajero aceptada</Typography>
            </TouchableOpacity>
        </View>
    )
}


export default Pruebas