import { gql } from '@apollo/client';

export const manageSlotsQuery =gql`
query AllSlots {
  allSlots {
    id
    startDate
    startTime
    endTime
  }
}`

export const manageSingleSlotsQuery =gql`
query FindSlot($findSlotId: String!) {
  findSlot(id: $findSlotId) {
    id
    startDate
    startTime
    endTime
  }
}
`
