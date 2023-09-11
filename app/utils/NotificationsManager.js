import { useLazyQuery } from "@apollo/client"
import { MY_CONVERSATIONS } from "../graphql/messages"
import { useDispatch } from "react-redux"

const message_received = (notificacion, navigation) => {
    const dispatch = useDispatch()

    const [getConversations, { loadingConversations, errorConversations, dataConversations }] = useLazyQuery(MY_CONVERSATIONS, {
        onCompleted: (dataConversations) => {
            dispatch(setConversations(dataConversations.myConversations.edges))
        },
        onError: (errorConversations) => {
            navigation.navigate('MessagesScreen')
        },
        fetchPolicy: "no-cache"
    })
    getConversations()
}

export { message_received }