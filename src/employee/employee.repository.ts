import { Injectable, Logger } from "@nestjs/common"
import { Employee } from "./models/employee.model"

@Injectable()
export class EmployeeRepository {
  private readonly logger = new Logger(EmployeeRepository.name)

  private employees: Employee[] = [
    { id: 1, name: "John Smith", position: "CTO", managerId: null },
    { id: 2, name: "Jane Doe", position: "Senior Software Engineer", managerId: 1 },
    { id: 3, name: "Bob Johnson", position: "Software Engineer", managerId: 2 },
    { id: 4, name: "Alice Williams", position: "Software Engineer", managerId: 2 },
    { id: 5, name: "Charlie Brown", position: "QA Engineer", managerId: 1 },
    { id: 6, name: "Diana Prince", position: "Junior Software Engineer", managerId: 2 },
    { id: 7, name: "Edward Norton", position: "DevOps Engineer", managerId: 1 },
  ]

  async findAll(): Promise<Employee[]> {
    this.logger.log("Finding all employees")
    return this.employees
  }
}