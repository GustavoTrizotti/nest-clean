import { Module } from "@nestjs/common";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { GetRecentQuestionsController } from "./controllers/get-recent-questions.controller";
import { TestController } from "./controllers/test.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [
    TestController,
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    GetRecentQuestionsController,
  ],
  providers: [PrismaService],
})
export class HttpModule {}
