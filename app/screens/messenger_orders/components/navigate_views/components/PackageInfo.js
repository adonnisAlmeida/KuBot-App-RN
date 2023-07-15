import { View, Text } from 'react-native'
import React from 'react'
import { Typography } from '../../../../../components'
import Colors from '../../../../../constants/Colors'
import { useState } from 'react'
import { useEffect } from 'react'

const PackageInfo = ({ pickedDate }) => {
    /* console.log(new Date(pickedDate))
    console.log(new Date()) */

    const [dias, setDias] = useState(0)
    const [horas, setHoras] = useState(0)
    const [minutos, setMinutos] = useState(0)
    const [segundos, setSegundos] = useState(0)
    const [diff, setDiff] = useState(0)

    function diff_hours(dt2, dt1) {

        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= (60 * 60);

        setDiff(Math.abs(Math.round(diff)))

        // get total seconds between the times
        var delta = Math.abs(dt2 - dt1) / 1000;

        console.log("DELTAA >> ", delta)
        console.log("dt2 >> ", dt2)
        console.log("dt1 >> ", dt1)
        console.log("pickedDate >> ", pickedDate)

        // calculate (and subtract) whole days
        var days = Math.floor(delta / 86400);
        delta -= days * 86400;

        // calculate (and subtract) whole hours
        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        // calculate (and subtract) whole minutes
        var minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        // what's left is seconds
        var seconds = delta % 60;  // in theory the modulus is not required

        if (days != dias) setDias(days)
        if (hours != horas) setHoras(hours)
        if (minutes != minutos) setMinutos(minutes)
        if (seconds != segundos) setSegundos(Math.round(seconds))

        let output = {
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds,
        }
        return output

    }

    const MINUTE_MS = 60000;

    useEffect(() => {
        //console.log("pickedDate >> ", pickedDate)
        console.log("Diferencia >> ", diff_hours(new Date(), new Date(pickedDate)))
        const interval = setInterval(() => {
            console.log("Diferencia >> ", diff_hours(new Date(), new Date(pickedDate)))
        }, MINUTE_MS);

        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [])

    const colorHours = (hours) => {
        if(hours < 47){
            return Colors.COLORS.PRIMARY
        }else {
            return Colors.COLORS.ERROR
        }
    }

    return (
        <View style={{
            padding: 10,
            backgroundColor: Colors.COLORS.INFO
        }}>
            <Typography size={16} >No debe tener más de 48 horas el paquete en su poder.</Typography>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
            }}>
                {/* <View style={{flexDirection: 'row'}}>
                    <Typography>diff: </Typography>
                    <Typography>{diff}</Typography>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Typography>Dias: </Typography>
                    <Typography>{dias}</Typography>
                </View> */}
                <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                    <Typography size={16} color={diff < 47 ? Colors.COLORS.PRIMARY : Colors.COLORS.ERROR}>Horas: </Typography>
                    <Typography size={16} color={diff < 47 ? Colors.COLORS.PRIMARY : Colors.COLORS.ERROR}>{diff}</Typography>
                </View>
                <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                    <Typography size={16} color={diff < 47 ? Colors.COLORS.PRIMARY : Colors.COLORS.ERROR}>Minutos: </Typography>
                    <Typography size={16} color={diff < 47 ? Colors.COLORS.PRIMARY : Colors.COLORS.ERROR}>{minutos}</Typography>
                </View>
                {/* <View style={{flexDirection: 'row'}}>
                    <Typography>Segundos: </Typography>
                    <Typography>{segundos}</Typography>
                </View> */}
            </View>
        </View>
    )
}

export default PackageInfo