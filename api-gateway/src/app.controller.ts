import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Authorization } from './decorators/authorization.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Authorization(true)
  getMain(): string {
    return this.appService.getText();
  }
}
