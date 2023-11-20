import { string, number, array, record, object, size, optional, defaulted, assign, type Infer } from 'superstruct'


export const DataObjectSchema = object({
  code: number(),
  message: string(),
  data: object()
})

export const DataArraySchema = object({
  code: number(),
  message: string(),
  data: array()
})

export const DataStringSchema = object({
  code: number(),
  message: string(),
  data: string()
})

export type DataObject = Infer<typeof DataObjectSchema>
export type DataArray = Infer<typeof DataArraySchema>
export type DataString = Infer<typeof DataStringSchema>