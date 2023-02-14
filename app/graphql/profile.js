import { gql } from '@apollo/client'

export const CARRIER_UPDATE = gql`
mutation carrierUpdate($id: Int!, $input: CarrierEditInput!) {
    carrierUpdate(id: $id, input: $input) {
        carrier{
            piPhotoFrontal{
                image{
                    url
                }
            }
            piPhotoBack{
                image{
                    url
                }
            }
            bustPhoto{
                image{
                    url
                }
            }
        }
    }
}
`

export const DELIVERED_IMAGEUPDATE = gql`
mutation shipmentDeliveredPackageImage($id: ID!, $input: ShipmentDeliveredInput!) {
    shipmentDeliveredPackageImage(id: $id, input: $input) {
        carrier{
            piPhotoFrontal{
                image{
                    url
                }
            }
            piPhotoBack{
                image{
                    url
                }
            }
            bustPhoto{
                image{
                    url
                }
            }
        }
    }
}
`
