import { View, Text, StyleSheet, RefreshControl, FlatList } from 'react-native'
import React from 'react'
import { useTheme } from '@react-navigation/native'
import Colors from '../../../constants/Colors'
import MessagesItem from './MessagesItem'
import { Typography } from '../../../components'

const MessagesList = ({ navigation, list, doRefresh, loadMore, renderLoader, refreshing }) => {
    const { colors } = useTheme()

	const onRefresh = () => {
		doRefresh()
	}

  return (
    <View>
			<FlatList
				style={styles.constains}
				showsVerticalScrollIndicator={true}
				data={list}
				//ListFooterComponent={renderLoader}
				//onEndReached={loadMore}
				//onEndReachedThreshold={0.5}
				refreshControl={
					<RefreshControl
						colors={[Colors.COLORS.PRIMARY]}
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				}
				renderItem={({ item, index, separators }) => (
					/* <Typography>{item.node.conversationUser.userName}</Typography> */
					<MessagesItem navigation={navigation} message={item} key={item.node.conversationUser.serverId} />
				)}
			/>
		</View>
  )
}

export default MessagesList

const styles = StyleSheet.create({
	constains: {
		/* marginTop: -12,
		margin: 12,
		paddingVertical: 18, */
		paddingHorizontal: 18,
	},
})