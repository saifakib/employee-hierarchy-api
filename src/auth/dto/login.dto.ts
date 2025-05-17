import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class LoginDto {
  @ApiProperty({ example: "admin" })
  @IsNotEmpty()
  @IsString()
  username: string

  @ApiProperty({ example: "password" })
  @IsNotEmpty()
  @IsString()
  password: string
}
