import { z } from "zod"


export const ClientPayloadSchema = z.object({
  username: z.string(),
  cpf: z.string(),
  phone: z.string(),
  email: z.string(),
  user_id: z.number(),
})
