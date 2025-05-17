export class Employee {
  id: number
  name: string
  position: string
  managerId: number | null

  constructor(partial: Partial<Employee>) {
    Object.assign(this, partial)
  }
}
