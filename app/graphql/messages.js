import { gql } from '@apollo/client'

export const SENT_MESSAGES = gql`
	query messages($after: String, $before: String, $author:ID, $recipients: [ID]) {
		messages(first: 100, after: $after, before: $before, author:$author, recipients:$recipients) {
			edges{
				node{
					serverId
					createdAt
					title
					content
					id
					thread{
						createdAt
						updatedAt
					}
					author{
						serverId
						id
						userName
						firstName
						lastName
						avatar{
							url
							alt
						}
					}
					recipients{
						serverId
						id
						userName
						firstName
						lastName
						avatar{
							url
							alt
						}
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

export const RECEIVED_MESSAGES = gql`
	query messages($after: String, $before: String, $author:ID, $recipients: [ID]) {
		messages(first: 100, after: $after, before: $before, author:$author, recipients:$recipients) {
			edges{
				node{
					serverId
					createdAt
					title
					content
					id
					thread{
						createdAt
						updatedAt
					}
					recipients{
						serverId
						id
						userName
						firstName
						lastName
						avatar{
							url
							alt
						}
					}
					author{
						serverId
						id
						userName
						firstName
						lastName
						avatar{
							url
							alt
						}
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
export const SEND_MESSAGE = gql`
	mutation sendMessage($messageInput: MessageInput!) {
		messageCreate( input: $messageInput) {
			errors{
				field
				message
			}
			message{
				serverId
					createdAt
					title
					content
					id
					thread{
						createdAt
						updatedAt
					}
					recipients{
						serverId
						id
						userName
						firstName
						lastName
						avatar{
							url
							alt
						}
					}
					author{
						serverId
						id
						userName
						firstName
						lastName
						avatar{
							url
							alt
						}
					}
			}
		}
	}
`
export const ALL_USERS = gql`
	query users($after: String, $before: String) {
		users(first: 100, after: $after, before: $before) {
			edges {
				node {
					serverId
					firstName
					lastName
					userName
					avatar{
						url
						alt
					}
					dateJoined
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
