export const CustomResponse = (
  res: any,
  success: boolean ,
  message: string,
  data: any = null,
  code: number 
) => {
  return res.status(code).json({
    success,
    data,
    message,
    code,
    timestamp: new Date().toISOString(),
  });
};

// custom error extends Error
export class CustomError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public data?: any
  ) {
    super(message);
    this.name = 'CustomError';
  }
}