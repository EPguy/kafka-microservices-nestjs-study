import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  getText(): string {
    return 'This is api gateway!';
  }
}
