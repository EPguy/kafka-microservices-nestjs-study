export class BaseResponseDto<Data> {
  status: number;
  message: string;
  data: Data;

  constructor(status: number, message: string, data: Data) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
