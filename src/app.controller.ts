import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  /**
   * Initializes the AppController with the AppService.
   * @param {AppService} appService - The AppService instance.
   */
  constructor(private readonly appService: AppService) {}

  /**
   * Handles GET requests to the root route.
   * @returns {string} The greeting message.
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
