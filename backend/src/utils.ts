import { Task, TaskStatus } from "@prisma/client"

export function isValidDate(dateString: string) {
    return !isNaN(Date.parse(dateString))
}

export function isValidStatus(status: TaskStatus){
    return Object.values(TaskStatus).includes(status)
}