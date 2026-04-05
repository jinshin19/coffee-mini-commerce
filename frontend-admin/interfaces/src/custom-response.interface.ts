export interface CustomResponseI<T> {
  success: boolean;
  httpCode: number;
  message?: string;
  data?: T;
  error?: any;
}
