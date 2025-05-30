// Helper to wrap async route handlers and ensure they return a Promise
export const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next)
