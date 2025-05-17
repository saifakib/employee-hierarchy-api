import { Body, Controller, Post } from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { AuthService } from "./auth.service"
import { LoginDto } from "./dto/login.dto"
import { Public } from "./decorators/public.decorator"
import { LoginResponseDto } from "./dto/login-response.dto"

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @Public()
  @ApiOperation({ summary: "Login to get JWT token" })
  @ApiResponse({
    status: 200,
    description: "Returns JWT token",
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto.username, loginDto.password)
  }
}
