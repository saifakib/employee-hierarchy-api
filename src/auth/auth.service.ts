import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    // Mock user
    const user = { id: 1, username: "admin", password: "admin" }
    if (username === user.username && password === user.password) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password)
    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }
    const payload = { sub: user.id, username: user.username }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
