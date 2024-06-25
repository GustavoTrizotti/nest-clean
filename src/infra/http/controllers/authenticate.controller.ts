import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compareSync } from "bcryptjs";
import { ZodValidationPipe } from "@/infra/http/pipes/zod.validation.pipe";
import { PrismaService } from "@/infra/prisma/prisma.service";
import { z } from "zod";

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBody = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBody) {
    const { email, password } = body;

    const user = this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User credentials do not match!");
    }

    const isPassword = compareSync(password, (await user).password);

    if (!isPassword) {
      throw new UnauthorizedException("User password do not match!");
    }

    const token = await this.jwt.signAsync({ sub: (await user).id });

    return {
      access_token: token,
    };
  }
}
