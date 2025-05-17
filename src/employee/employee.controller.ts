import { Controller, Get, Logger, Param } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
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

  @Get(':id/hierarchy')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all employees under a given position in the hierarchy' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all employees under the specified position', 
    type: [EmployeeResponseDto] 
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  async findHierarchy(@Param('id') id: number): Promise<EmployeeResponseDto[]> {
    this.logger.log(`GET /employees/${id}/hierarchy`);
    const employees = await this.employeeService.findHierarchy(id);
    return employees.map(employee => new EmployeeResponseDto(employee));
  }
}
