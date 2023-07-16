import { gql } from '@apollo/client'

export const PI_PHOTO_FRONTAL_UPDATE = gql`
mutation carrierPiPhotoFrontalUpdate($id: ID!, $image: Upload!) {
    carrierPiPhotoFrontalUpdate(id: $id, input: {image: $image}) {
        carrier{
            kyc
            isActive
            piPhotoFrontal{
                image{
                  url
                }
            }
        }
    }
}
`

export const PI_PHOTO_BACK_UPDATE = gql`
mutation carrierPiPhotoBackUpdate($id: ID!, $image: Upload!) {
    carrierPiPhotoBackUpdate(id: $id, input: {image: $image}) {
        carrier{
            kyc
            isActive
            piPhotoBack{
                image{
                  url
                }
            }
        }
    }
}
`

export const BUST_PHOTO_UPDATE = gql`
mutation carrierBustPhotoUpdate($id: ID!, $image: Upload!) {
    carrierBustPhotoUpdate(id: $id, input: {image: $image}) {
        carrier{
            kyc
            isActive
            bustPhoto{
                image{
                  url
                }
            }
        }
    }
}
`