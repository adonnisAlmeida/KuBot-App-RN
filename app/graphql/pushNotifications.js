import { gql } from '@apollo/client'

export const PN_CREATE = gql`
    mutation PushNotificationsCreate($deviceToken: String!) {
        pushNotificationsCreate(deviceToken: $deviceToken) {
            device{
                serverId
                token
                user{
                    userName
                }
            }
        }
    }
`

export const PN_DELETE = gql`
    mutation PushNotificationsDelete($deviceToken: String!) {
        pushNotificationsDelete(deviceToken: $deviceToken) {
            device{
                serverId
                token
                user{
                    userName
                }
            }
        }
    }
`
