import { ApiProperty } from "@nestjs/swagger"

export class EmployeeResponseDto {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty({ example: "John Doe" })
  name: string

  @ApiProperty({ example: "CTO" })
  position: string

  @ApiProperty({ example: null, nullable: true })
  managerId: number | null

  constructor(partial: Partial<EmployeeResponseDto>) {
    Object.assign(this, partial)
  }
}
