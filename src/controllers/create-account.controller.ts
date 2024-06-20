import {
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from "@nestjs/common";
import { hash } from "bcryptjs";
import { ZodValidationPipe } from "@/pipes/zod.validation.pipe";
import { PrismaService } from "@/prisma/prisma.service";
import { z } from "zod";

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateAccountBody = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBody) {
    const { name, email, password } = createAccountBodySchema.parse(body);
    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    const hashedPassword = await hash(password, 8);

    if (userWithSameEmail)
      throw new ConflictException(
        "User with same e-mail address already exists!"
      );

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }
}
