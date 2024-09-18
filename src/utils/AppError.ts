class AppError extends Error {
  public readonly code: number
  public readonly status: string
  public readonly message: string

  constructor(code: number, message: string) {
    super(message)
    this.code = code
    this.status = this.getStatusFromCode(code)
    this.message = message
  }

  private getStatusFromCode(code: number): string {
    switch (code) {
      case 400:
        return 'Bad Request'
      case 401:
        return 'Unauthorized'
      case 403:
        return 'Forbidden'
      case 404:
        return 'Not Found'
      case 500:
        return 'Internal Server Error'
      default:
        return 'Internal Server Error'
    }
  }
}

export function AppErrorToJSON(data: AppError): {
  code: number
  status: string
  message: string
} {
  return {
    code: data.code,
    status: data.status,
    message: data.message,
  }
}
export default AppError
