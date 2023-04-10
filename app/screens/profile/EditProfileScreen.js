import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
	Platform,
	StyleSheet,
	View,
	ToastAndroid,
	TextInput,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	ActivityIndicator,
	Modal,
	TouchableWithoutFeedback,
	ImageBackground,
} from 'react-native'
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useTheme } from '@react-navigation/native'
import { useMutation } from '@apollo/client'
import { ReactNativeFile } from 'apollo-upload-client'
import Typography from '../../components/Typography'
import Button from '../../components/Button'
import { ACCOUNT_UPDATE, USER_AVATAR_UPDATE } from '../../graphql/customers'
import { setUser, user } from '../../redux/userlogin/userLoginSlice'
import { useState, useEffect } from 'react'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from '../../constants/Colors'

export default function EditProfileScreen({ navigation, route }) {
	const { colors } = useTheme()
	const dispatch = useDispatch()
	const user_state = useSelector(user)

	const user_id = route.params?.user_id,
		user_firstName = route.params?.user_firstName,
		user_lastName = route.params?.user_lastName,
		user_avatarURL = route.params?.user_avatarURL

	const [firstName, setFirstName] = useState()
	const [lastName, setLastName] = useState()
	const [avatarURL, setAvatarURL] = useState()
	const [showModal, setShowModal] = useState(false)
	const [vistaPrevia, setVistaPrevia] = useState(null)
	const [confirmModal, setConfirmModal] = useState(false)
	const [errors, setErrors] = useState([])
	const [activity, setActivity] = useState(false)
	const [photoFile, setPhotoFile] = useState(null)

	//console.log("user_avatar", user_avatarURL)

	useEffect(() => {
		setFirstName(user_firstName)
		setLastName(user_lastName)
		const avatar = user_avatarURL
			? {
				uri: user_avatarURL,
			}
			: require('../../../assets/user_avatar.png')
		setAvatarURL(avatar)
	}, [user_firstName, user_lastName])

	navigation.setOptions({
		title: `Editar`,
		//title: `Editar - ${firstName}`,
	})

	const [accountUpdate, { loading, error, data }] = useMutation(ACCOUNT_UPDATE, {
		onCompleted: (data) => {
			console.log("Actualizoooo ", data)
			if (Platform.OS === 'android')
				ToastAndroid.show('Se actualizó el usuario correctamente.', ToastAndroid.LONG)
			dispatch(
				setUser({
					...user_state,
					firstName: firstName,
					lastName: lastName,
				})
			)
			navigation.goBack()
		},
		onError: (error) => {
			if (Platform.OS === 'android')
				ToastAndroid.show('Error actualizando el perfil.', ToastAndroid.LONG)
			navigation.navigate('Profile')
			console.log('Error accountUpdate >> ', error)
		}
	})

	const [userAvatarUpdate, { loadingAvatar, errorAvatar, dataAvatar }] = useMutation(USER_AVATAR_UPDATE, {
		onCompleted: (dataAvatar) => {
			console.log("userAvatarUpdate Actualizoooo ", dataAvatar)
			if (Platform.OS === 'android')
				ToastAndroid.show('Avatar actualizado correctamente.', ToastAndroid.LONG)
			setActivity(false)
			setConfirmModal(false)
			setAvatarURL(vistaPrevia)
			dispatch(
				setUser({
					...user_state,
					avatar: dataAvatar.userAvatarUpdate.user.avatar
				})
			)
		},
		onError: (errorAvatar) => {
			setActivity(false)
			setConfirmModal(false)
			if (Platform.OS === 'android')
				ToastAndroid.show('Error actualizando el avatar.', ToastAndroid.LONG)
			console.log('Error userAvatarUpdate >> ', errorAvatar)
		}
	})

	const hasErrors = (key) => (errors.includes(key) ? styles.hasErrors : null)

	const handleEdit = () => {
		let error_data = []

		if (firstName.length == 0) error_data.push('firstName')
		if (lastName.length == 0) error_data.push('lastName')

		if (error_data.length > 0) setErrors(error_data)
		else {
			accountUpdate({
				variables: {
					firstName: firstName,
					lastName: lastName
				},
			})

		}
	}

	const openCamera = async () => {
		setShowModal(false)
		var options = { mediaType: 'photo' };
		const picker_result = await launchCamera(options);
		if (!picker_result.didCancel) {
			//setAvatarURL({ uri: picker_result.assets[0].uri, })
			setVistaPrevia({ uri: picker_result.assets[0].uri, })
			setConfirmModal(true)
			const file = new ReactNativeFile({
				uri: picker_result.assets[0].uri,
				name: picker_result.assets[0].fileName,
				type: picker_result.assets[0].type,
			});
			setPhotoFile(file)
		}
	}

	const openGalery = async () => {
		setShowModal(false)
		var options = { mediaType: 'photo' };
		const picker_result = await launchImageLibrary(options);
		if (!picker_result.didCancel) {
			//setAvatarURL({ uri: picker_result.assets[0].uri, })
			setVistaPrevia({ uri: picker_result.assets[0].uri, })
			setConfirmModal(true)
			const file = new ReactNativeFile({
				uri: picker_result.assets[0].uri,
				name: picker_result.assets[0].fileName,
				type: picker_result.assets[0].type,
			});
			setPhotoFile(file)
		}
	}

	const sendImage = () => {
		setActivity(true)
		userAvatarUpdate({
			variables: { image: photoFile }
		})
	}

	const profilePhotoEdit = () => {
		setShowModal(true)
	}

	return (
		<ScrollView style={styles.container}>
			<View style={styles.imageContainer}>
				<View style={styles.editIcon}>
					<TouchableOpacity
						style={styles.whatButton}
						onPress={() => profilePhotoEdit()} >
						<FontAwesome
							style={styles.buttonEdit}
							name="edit"
							color={colors.ON_SURFACE}
							size={22}
						/>
					</TouchableOpacity>
				</View>
				<View>
					<Image
						indicator={Progress.Pie}
						indicatorProps={{
							color: Colors.COLORS.PRIMARY,
							borderWidth: 0,
						}}
						source={avatarURL}
						imageStyle={styles.imageStyles}
					/>
				</View>
			</View>
			<View style={{ marginBottom: 15 }}>
				<Typography bold
					color={colors.ON_SURFACE_VARIANT}
				//style={{ marginVertical: 10 }}
				>
					Nombre:
				</Typography>
				<TextInput
					value={firstName}
					style={[
						styles.input,
						hasErrors('firstName'),
						{ color: colors.ON_BACKGROUND },
					]}
					onChangeText={(text) => setFirstName(text)}
				/>
			</View>
			<View style={{ marginBottom: 15 }}>
				<Typography bold
					color={colors.ON_SURFACE_VARIANT}
				//style={{ marginVertical: 10 }}
				>
					Apellidos:
				</Typography>
				<TextInput
					value={lastName}
					style={[
						styles.input,
						hasErrors('lastName'),
						{ color: colors.ON_BACKGROUND },
					]}
					onChangeText={(text) => setLastName(text)}
				/>
			</View>
			<Button
				color={Colors.COLORS.WEB_BUTTON}
				style={{ alignItems: 'center', marginVertical: 16 }}
				onPress={() => handleEdit()}
			>
				{loading ? (
					<ActivityIndicator />
				) : (
					<Typography color="#ffffff">Actualizar</Typography>
				)}

			</Button>
			<Modal
				visible={confirmModal}
				transparent={true}
				animationType="fade"
				onRequestClose={() => setConfirmModal(false)}
			>

				<View
					style={styles.modalView}
				//onPressOut={() => setConfirmModal(false)}
				>
					<ImageBackground
						resizeMode='contain'
						style={styles.vistaPrevia}
						source={vistaPrevia}
					/>
					<View style={styles.topButtons}>
						<TouchableOpacity style={styles.cancelIcon} onPress={() => setConfirmModal(false)}
						>
							<Ionicons
								name='ios-close-circle-outline'
								size={40}
								color='rgba(255,255,255,0.9)'
							/>
						</TouchableOpacity>
						{activity ? (
							<ActivityIndicator
								//style={styles.aIndicator}
								color={Colors.COLORS.SUCCESS}
								size='large'
							/>
						) : (
							<TouchableOpacity style={styles.okIcon} onPress={() => sendImage()}
							>
								<Ionicons
									name='ios-checkmark-circle-outline'
									size={40}
									color={Colors.COLORS.SUCCESS}
								/>
							</TouchableOpacity>
						)}

					</View>
				</View>
			</Modal>
			<Modal
				visible={showModal}
				transparent={true}
				animationType="fade"
				onRequestClose={() => setShowModal(false)}
			>
				<TouchableOpacity
					style={styles.centeredView}
					onPressOut={() => setShowModal(false)}
				>
					<TouchableWithoutFeedback>
						<View style={styles.selectModal}>
							<TouchableOpacity onPress={() => openCamera()}>
								<FontAwesome
									name="camera-retro"
									color={colors.PRIMARY}
									size={35}
								/>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => openGalery()}>
								<FontAwesome
									name="photo"
									color={colors.PRIMARY}
									size={35}
								/>
							</TouchableOpacity>
						</View>
					</TouchableWithoutFeedback>
				</TouchableOpacity>
			</Modal>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	whatButton: {
		/* backgroundColor: Colors.COLORS.PRIMARY,
		padding: 10,
		borderRadius: 100,
		position: 'absolute',
		bottom: 10,
		right: 30, */
	},
	topButtons: {
		paddingHorizontal: 25,
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%'
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.7)'
	},
	selectModal: {
		flexDirection: 'row',

		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 20,
		width: 150,
		height: 100,
		backgroundColor: '#fff',
		margin: 42,
		borderRadius: 12,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowColor: '#000000',
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 8,
	},
	modalView: {
		flex: 1,
		paddingTop: 20,
		/* justifyContent: 'center',
		alignItems: 'center', */
		backgroundColor: 'rgba(0,0,0,0.7)'
	},
	vistaPrevia: {
		marginTop: 10,
		//marginHorizontal: 10,
		height: Dimensions.get('window').height * 0.85,
		width: '100%'
		/* marginTop: 10,
		marginHorizontal: 10,
		height: 500,
		resizeMode: 'contain',
		width: '99%' */
	},
	/* buttonEdit: {
		position: 'absolute',
		top: 18,
		right: 0,
	}, */
	editIcon: {
		backgroundColor: Colors.COLORS.PRIMARY,
		padding: 10,
		borderRadius: 100,
		bottom: 10,
		right: 80,
		position: 'absolute',
		//right: 0,
		zIndex: 10
	},
	imageContainer: {
		//flex: 1,
		//height: 200,
		marginBottom: 20
	},
	imageStyles: {
		position: 'relative',
		resizeMode: 'contain',
		marginTop: 10,
		alignSelf: 'center',
		width: 200,
		height: 200,
		borderRadius: 100,
		//backgroundColor: 'red'
	},
	container: {
		flex: 1,
		padding: 16,
	},
	input: {
		borderRadius: 0,
		borderWidth: 0,
		borderBottomColor: '#8E8E8E',
		borderBottomWidth: StyleSheet.hairlineWidth,
		height: 45,
	},
	hasErrors: {
		borderBottomColor: '#CF6679',
	},
})
