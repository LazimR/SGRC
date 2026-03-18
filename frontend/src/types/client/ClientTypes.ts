import { z } from "zod"
import { RegisterClientSchema } from "../../schemas/RegisterClientSchema"
import { ClientPayloadSchema } from "../../schemas/clientPayloadSchema"


export type RegisterClientFormInput = z.input<typeof RegisterClientSchema>
export type RegisterClientFormOutput = z.output<typeof ClientPayloadSchema>
