import React from 'react'
import { Modal, StyleSheet, Text, Pressable, View } from 'react-native'
import { useTheme } from '@react-navigation/native'

export default function useAlert({ title, subtitle, buttons }) {
	const { colors } = useTheme()
	const [visible, setVisible] = React.useState(false)

	const showAlert = () => setVisible(true)
	const hideAlert = () => setVisible(false)

	const alert = (
		<View>
			<Modal
				animationType="fade"
				transparent={true}
				visible={visible}
				onRequestClose={() => {
					hideAlert(!visible)
				}}
			>
				<View style={styles.centeredView}>
					<View
						style={[
							styles.modalView,
							{
								backgroundColor: colors.MODAL,
							},
						]}
					>
						<Text
							style={[
								styles.modalText,
								{ color: colors.ON_MODAL, fontSize: 18 },
							]}
						>
							{title}
						</Text>
						<Text
							style={[styles.modalText, { color: colors.ON_SURFACE_VARIANT }]}
						>
							{subtitle}
						</Text>
						<View style={styles.buttons}>
							{buttons.map((buttons, index) => (
								<Pressable
									key={index}
									style={styles.button}
									onPress={() =>
										buttons.style == 'cancel' ? hideAlert() : buttons.onPress()
									}
								>
									<Text
										style={[
											styles.textStyle,
											{
												color:
													buttons.style == 'cancel'
														? colors.ON_MODAL
														: buttons.style == 'delete'
														? colors.ERROR
														: colors.primary,
											},
										]}
									>
										{buttons.title}
									</Text>
								</Pressable>
							))}
						</View>
					</View>
				</View>
			</Modal>
		</View>
	)

	return { alert, showAlert, hideAlert }
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		margin: 42,
		borderRadius: 12,
		padding: 28,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowColor: '#000000',
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 8,
	},
	buttons: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginLeft: 10,
		marginRight: 10,
		marginTop: 10,
	},
	button: {
		padding: 5,
		paddingLeft: 25,
		paddingRight: 25,
	},
	textStyle: {
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},
})
