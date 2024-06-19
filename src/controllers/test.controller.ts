import { Controller, Get } from "@nestjs/common";

@Controller("/test")
export class TestController {
  @Get()
  async handle() {
    return "Hello World!";
  }
}
