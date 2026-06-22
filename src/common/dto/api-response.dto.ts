/**
 * Chuẩn hoá response format cho toàn bộ API.
 * Tất cả response đều trả về theo format này.
 */
export class ApiResponseDto<T> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;

  constructor(success: boolean, message: string, data?: T) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  static ok<T>(data: T, message = 'Success'): ApiResponseDto<T> {
    return new ApiResponseDto(true, message, data);
  }

  static error(message: string): ApiResponseDto<null> {
    return new ApiResponseDto(false, message);
  }
}
