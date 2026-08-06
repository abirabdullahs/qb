import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: Record<string, any>;
}

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function apiSuccess<T>(data: T, message?: string, statusCode = 200, meta?: Record<string, any>) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
      message,
      meta,
    },
    { status: statusCode }
  );
}

export function apiError(message: string, statusCode = 400) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: message,
    },
    { status: statusCode }
  );
}

export function handleApiError(err: unknown) {
  console.error('[API Error]:', err);
  if (err instanceof AppError) {
    return apiError(err.message, err.statusCode);
  }
  if (err instanceof Error) {
    return apiError(err.message, 500);
  }
  return apiError('Internal Server Error', 500);
}
