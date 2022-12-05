export class BaseResponseDto<Data> {
  status: number;
  message: string;
  data: Data;
  error: string;
}
