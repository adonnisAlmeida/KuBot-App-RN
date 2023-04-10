import { gql } from '@apollo/client'

export const GET_DELIVERY_SCHEDULE = gql`
    query Events($carrierServerId: Int,) {
        events(first: 100, carrier: $carrierServerId) {
            edges {
                node {
                    serverId
                    start
                    end
                    title
                    endRecurringPeriod
                    description
                    createdOn
                    updatedOn
                    rule{
                        name
                        description
                        frequency
                        serverId
                    }
                    id
                }
            }
        }
    }
`

export const UPDATE_DELIVERY_SCHEDULE = gql`
    mutation UpdateEvent(
        $id: ID!,
        $description: String,
        $start: DateTime,
        $end: DateTime,
        $title:String,
        $rule: Int,
        $endRecurringPeriod: DateTime,
        ) {
            eventUpdate( id : $id, input: { 
            description: $description,
            start: $start,
            end: $end,
            title: $title,
            rule: $rule,
            endRecurringPeriod:$endRecurringPeriod,}) {
        event{
            serverId
            start
            endRecurringPeriod
            end
            title
            description
            createdOn
            updatedOn
            rule{
                name
                description
                frequency
                serverId
            }
            id
        }
        calendarErrors{
            field
            message
        }
        errors{
            field
            message
        }
    }
}
`

export const GET_DELIVERY_SCHEDULE_RULES = gql`
    query Rules {
        rules(first:100) {
            edges {
                node {
                    id
                    name
                    description
                    frequency
                    serverId
                }
            }
        }
    }
`

export const DELETE_DELIVERY_SCHEDULE = gql`
    mutation DeleteEvent($id: Int!) {
        eventDelete(id: $id) {
            errors{
                field
                message
            }
            event{
                serverId
                id
                start
                endRecurringPeriod
                end
                title
                description
                createdOn
                updatedOn
                rule{
                    name
                    description
                    frequency
                    serverId
                }
            }
        }
    }
`

export const CREATE_DELIVERY_SCHEDULE = gql`
mutation CreateEvent(
    $description: String!,
    $start: DateTime,
    $end: DateTime,
    $endRecurringPeriod: DateTime,
    $carrier: Int,
    $title:String,
    $rule: Int,
  ) {
        eventCreate(input: { 
        description: $description,
        start: $start,
        end: $end,
        endRecurringPeriod: $endRecurringPeriod,
        carrier: $carrier,
        title: $title,
        rule: $rule}) {
    event{
        serverId
        id
        start
        endRecurringPeriod
        end
        title
        description
        createdOn
        updatedOn
        rule{
            name
            description
            frequency
            serverId
        }
      }
      calendarErrors{
        field
        message
      }
              errors{
                  field
                  message
              }
          }
      }
  
`
