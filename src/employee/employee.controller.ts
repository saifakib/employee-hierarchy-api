import { Controller, Get, Logger } from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { EmployeeService } from "./employee.service"
import { EmployeeResponseDto } from "./dto/employee-response.dto"
import { Public } from "../auth/decorators/public.decorator"

@ApiTags("employees")
@Controller("employees")
export class EmployeeController {
  private readonly logger = new Logger(EmployeeController.name)

  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: "Get all employees" })
  @ApiResponse({
    status: 200,
    description: "Returns all employees",
    type: [EmployeeResponseDto],
  })
  async findAll(): Promise<EmployeeResponseDto[]> {
    this.logger.log("GET /employees")
    const employees = await this.employeeService.findAll()
    return employees.map((employee) => new EmployeeResponseDto(employee))
  }
}
