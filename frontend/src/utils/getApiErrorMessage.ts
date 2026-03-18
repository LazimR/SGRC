export function getApiErrorMessage(response: any): string {
  if (response?.data?.errors?.length) {
    return response.data.errors[0].message
  }

  if (response?.data?.message) {
    return response.data.message
  }

  if (response?.message) {
    return response.message
  }

  return "Erro inesperado"
}
