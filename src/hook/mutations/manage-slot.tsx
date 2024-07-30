import { gql } from "@apollo/client";

export const manageSlotMutation= gql`
mutation CreateSlot($input: slotInput) {
  createSlot(input: $input) {
    id
    startDate
    startTime
    endTime
  }
}`
export const manageSlotBulkDeleteMutation= gql`
mutation BulkDeleteSlots($ids: [String]!) {
  bulkDeleteSlots(ids: $ids) {
    id
    startDate
    startTime
    endTime
  }

}`
export const manageSlotDeleteMutation= gql`
mutation DeleteSlot($deleteSlotId: String!) {
  deleteSlot(id: $deleteSlotId) {
    id
    startDate
    startTime
    endTime
  }

}`
export const manageSlotUpdateMutation= gql`
mutation UpdateSlot($input: slotUpdateInput) {
  updateSlot(input: $input) {
    id
    startDate
    startTime
    endTime
  }

}`