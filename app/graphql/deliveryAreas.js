import { gql } from '@apollo/client'

export const DELIVERY_ZONES = gql`
    query ZonasEntrega($after: String!, $before: String!, $carrier: Int) {
        deliveryZones(first: 100, after: $after, before: $before, carrier: $carrier) {
            edges {
                node {
                    id
                    name
                    serverId
                    parent{
                        name
                        id
                    }
                }
            }
            pageInfo{
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
        }
    }
`

export const ADD_DELIVERY_ZONES = gql`
        mutation addDeliveryZoneCarrier(
            $carrier: Int!,
            $ids: [Int]!,
        ) {
            addDeliveryZoneCarrier(input: { 
            carrier: $carrier,
            ids:$ids
                }) {
            carrier{
                serverId
            }
            errors{
                field
                message
            }
          }
      }
  
`