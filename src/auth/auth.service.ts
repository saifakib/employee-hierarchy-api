import { Injectable, UnauthorizedException, Logger } from "@nestjs/common"
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    this.logger.log(`Validating user: ${username}`)
    // Mock user
    const user = { id: 1, username: "admin", password: "admin" }
    if (username === user.username && password === user.password) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(username: string, password: string) {
    this.logger.log(`Login attempt for user: ${username}`)
    const user = await this.validateUser(username, password)
    if (!user) {
      this.logger.warn(`Invalid credentials for user: ${username}`)
      throw new UnauthorizedException("Invalid credentials")
    }
    const payload = { sub: user.id, username: user.username }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
