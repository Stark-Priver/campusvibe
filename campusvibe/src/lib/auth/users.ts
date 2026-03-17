import type { DashboardRoleSlug } from "@/lib/dashboardData"

export interface MockAuthUser {
  id: string
  fullName: string
  email: string
  password: string
  organization: string
  roles: DashboardRoleSlug[]
}

export const mockAuthUsers: MockAuthUser[] = [
  {
    id: "u-admin-01",
    fullName: "Asha Mwakalonge",
    email: "admin@campusvibe.co.tz",
    password: "Admin123!",
    organization: "Campus Vibe HQ",
    roles: ["administrator", "ambassador"],
  },
  {
    id: "u-student-01",
    fullName: "Brian Mshana",
    email: "student@campusvibe.co.tz",
    password: "Student123!",
    organization: "University of Dar es Salaam",
    roles: ["student", "ambassador"],
  },
  {
    id: "u-driver-01",
    fullName: "Neema Joseph",
    email: "driver@campusvibe.co.tz",
    password: "Driver123!",
    organization: "Campus Transport Fleet",
    roles: ["driver", "delivery"],
  },
  {
    id: "u-food-01",
    fullName: "Kelvin Mrema",
    email: "restaurant@campusvibe.co.tz",
    password: "Food123!",
    organization: "Campus Kitchen Partners",
    roles: ["restaurant-owner", "delivery"],
  },
]

export function getMockAuthUserById(id: string) {
  return mockAuthUsers.find((user) => user.id === id)
}

export function findMockAuthUserByCredentials(email: string, password: string) {
  return mockAuthUsers.find(
    (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password,
  )
}