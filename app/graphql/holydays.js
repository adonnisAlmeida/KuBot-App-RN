import { gql } from '@apollo/client'

export const CREATE_VACATION = gql`
	mutation CreateVatacion($description: String!, $startAt: Date, $finishAt: Date, $carrier: Int) {
		vacationCreate(input: { description: $description, startAt: $startAt, finishAt: $finishAt, carrier: $carrier }) {
			errors{
				field
				message
			}
			vacation{
				id
				description
				startAt
				finishAt
				serverId
			}
		}
	}
`

export const GET_HOLYDAYS_BY_CARRIER = gql`
	query HolyDaysByCarrier($carrierServerId: Int!, $after: String!, $before: String!) {
		vacations(first: 30, carrier: $carrierServerId, after: $after, before: $before) {
			edges {
				node {
					id
					description
					startAt
					finishAt
					serverId
				}
			}
			pageInfo {
				hasNextPage
				hasPreviousPage
				startCursor
				endCursor
			}
		}
	}
`

export const DELETE_HOLIDAY = gql`
	mutation VacationDelete($id: Int!) {
		vacationDelete(id: $id) {
			errors{
				field
				message
			}
			vacation{
				id
				description
				startAt
				finishAt
				serverId
			}
		}
	}
`
