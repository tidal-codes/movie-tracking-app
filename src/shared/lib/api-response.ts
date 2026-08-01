import { NextResponse } from "next/server";

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function apiSuccess<T>(
  data: T,
  status = 200,
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(
  error: string,
  status = 400,
  fieldErrors?: Record<string, string[]>,
): NextResponse<ApiError> {
  return NextResponse.json({ success: false, error, fieldErrors }, { status });
}
