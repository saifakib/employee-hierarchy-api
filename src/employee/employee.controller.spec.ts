import { Test, type TestingModule } from "@nestjs/testing"
import { EmployeeController } from "./employee.controller"
import { EmployeeService } from "./employee.service"
import { NotFoundException } from "@nestjs/common"
import type { Employee } from "./models/employee.model"
import { jest } from "@jest/globals"

describe("EmployeeController", () => {
  let controller: EmployeeController
  let service: EmployeeService

  const mockEmployees: Employee[] = [
    { id: 1, name: "John Smith", position: "CTO", managerId: null },
    { id: 2, name: "Jane Doe", position: "Senior Software Engineer", managerId: 1 },
    { id: 3, name: "Bob Johnson", position: "Software Engineer", managerId: 2 },
  ]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        {
          provide: EmployeeService,
          useValue: {
            findAll: jest.fn<() => Promise<Employee[]>>().mockResolvedValue(mockEmployees),
            findHierarchy: jest.fn().mockImplementation((id: number) => {
              if (id === 1) {
                return Promise.resolve([mockEmployees[1], mockEmployees[2]])
              }
              throw new NotFoundException(`Employee with id ${id} not found`)
            }),
          },
        },
      ],
    }).compile()

    controller = module.get<EmployeeController>(EmployeeController)
    service = module.get<EmployeeService>(EmployeeService)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  describe("findAll", () => {
    it("should return all employees", async () => {
      const result = await controller.findAll()
      expect(result).toHaveLength(3)
      expect(service.findAll).toHaveBeenCalled()
    })
  })


  describe("findHierarchy", () => {
    it("should return all subordinates for a given manager ID", async () => {
      const result = await controller.findHierarchy(1)

      expect(result).toHaveLength(2)
      expect(result[0].id).toEqual(2)
      expect(result[1].id).toEqual(3)
      expect(service.findHierarchy).toHaveBeenCalledWith(1)
    })

    it("should throw NotFoundException when an invalid manager ID is provided", async () => {
      await expect(controller.findHierarchy(999)).rejects.toThrow(NotFoundException)
      expect(service.findHierarchy).toHaveBeenCalledWith(999)
    })
  })
})
