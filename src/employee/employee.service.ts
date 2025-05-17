import { Injectable, Logger } from "@nestjs/common"
import { EmployeeRepository } from "./employee.repository"
import { Employee } from "./models/employee.model"

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger(EmployeeService.name)

  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.findAll()
  }
}
