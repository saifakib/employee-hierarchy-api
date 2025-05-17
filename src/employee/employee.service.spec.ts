import { Test, type TestingModule } from "@nestjs/testing"
import { EmployeeService } from "./employee.service"
import { EmployeeRepository } from "./employee.repository"
import { NotFoundException } from "@nestjs/common"
import type { Employee } from "./models/employee.model"
import { jest } from "@jest/globals"

describe("EmployeeService", () => {
  let service: EmployeeService
  let repository: EmployeeRepository

  const mockEmployees: Employee[] = [
    { id: 1, name: "John Smith", position: "CTO", managerId: null },
    { id: 2, name: "Jane Doe", position: "Senior Software Engineer", managerId: 1 },
    { id: 3, name: "Bob Johnson", position: "Software Engineer", managerId: 2 },
  ]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: EmployeeRepository,
          useValue: {
            findAll: jest.fn<() => Promise<Employee[]>>().mockResolvedValue(mockEmployees),
            findById: jest.fn().mockImplementation((id: number) => {
              const employee = mockEmployees.find((e) => e.id === id)
              return Promise.resolve(employee)
            }),
            findByManagerId: jest.fn().mockImplementation((managerId: number) => {
              const employees = mockEmployees.filter((e) => e.managerId === managerId)
              return Promise.resolve(employees)
            }),
          },
        },
      ],
    }).compile()

    service = module.get<EmployeeService>(EmployeeService)
    repository = module.get<EmployeeRepository>(EmployeeRepository)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("findAll", () => {
    it("should return all employees", async () => {
      const result = await service.findAll()
      expect(result).toEqual(mockEmployees)
      expect(repository.findAll).toHaveBeenCalled()
    })
  })

  describe("findById", () => {
    it("should return an employee when a valid ID is provided", async () => {
      const result = await service.findById(1)
      expect(result).toEqual(mockEmployees[0])
      expect(repository.findById).toHaveBeenCalledWith(1)
    })

    it("should throw NotFoundException when an invalid ID is provided", async () => {
      await expect(service.findById(999)).rejects.toThrow(NotFoundException)
      expect(repository.findById).toHaveBeenCalledWith(999)
    })
  })

  describe("findHierarchy", () => {
    it("should return all subordinates for a position manager ID", async () => {
      jest.spyOn(service as any, "findAllSubordinates").mockResolvedValueOnce([
        mockEmployees[1],
        mockEmployees[2],
      ])

      const result = await service.findHierarchy(1)

      expect(result).toHaveLength(2)
      expect(result).toContainEqual(mockEmployees[1])
      expect(result).toContainEqual(mockEmployees[2])
    })

    it("should throw NotFoundException when an invalid manager ID is provided", async () => {
      await expect(service.findHierarchy(999)).rejects.toThrow(NotFoundException)
    })
  })
})
