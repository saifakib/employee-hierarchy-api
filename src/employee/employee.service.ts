import { Injectable, Logger, NotFoundException } from "@nestjs/common"
import { EmployeeRepository } from "./employee.repository"
import { Employee } from "./models/employee.model"

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger(EmployeeService.name)

  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.findAll()
  }

    async findById(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findById(id)
    if (!employee) {
      this.logger.warn(`Employee with id ${id} not found`)
      throw new NotFoundException(`Employee with id ${id} not found`)
    }
    return employee
  }

  async findHierarchy(managerId: number): Promise<Employee[]> {
    this.logger.log(`Finding hierarchy for position with id: ${managerId}`)
    const manager = await this.findById(managerId)
    return this.findAllSubordinates(managerId)
  }

  private async findAllSubordinates(managerId: number): Promise<Employee[]> {
    const directReports = await this.employeeRepository.findByManagerId(managerId)
    const indirectReports = await Promise.all(
      directReports.map(async (employee) => {
        const subordinates = await this.findAllSubordinates(employee.id)
        return subordinates
      }),
    )
    return [...directReports, ...indirectReports.flat()]
  }
}
