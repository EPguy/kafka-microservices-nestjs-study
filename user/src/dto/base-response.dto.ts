export class BaseResponseDto<Data> {
  readonly status: number;
  readonly message: string;
  readonly data: Data;
  readonly error: string;
}
