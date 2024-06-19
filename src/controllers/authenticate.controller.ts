import { Controller, Post } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { z } from "zod";

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBody = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
export class AuthenticateController {
  constructor(private jwt: JwtService) {}

  @Post()
  async handle() {
    const token = await this.jwt.signAsync({ sub: "123" });

    return token;
  }
}
