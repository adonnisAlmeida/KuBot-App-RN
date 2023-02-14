import React from 'react'
import { Switch } from 'react-native'

import Colors from '../constants/Colors'

const GRAY_COLOR = 'rgba(168, 182, 200, 0.30)'

export default function SwitchInput({ value, ...props }) {
	return (
		<Switch
			trackColor={{
				false: Colors.COLORS.SWITCH_OFF,
				true: Colors.COLORS.SWITCH_ON,
			}}
			thumbColor={value ? Colors.COLORS.SWITCH_ON : '#f4f3f4'}
			ios_backgroundColor={GRAY_COLOR}
			value={value}
			{...props}
		/>
	)
}
