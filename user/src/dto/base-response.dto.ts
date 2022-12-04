export class BaseResponseDto<Data> {
  status: number;
  message: string;
  data: Data;
  error: string;

  constructor(status: number, message: string, data: Data, error: string) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.error = error;
  }
}
