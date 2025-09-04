import request from 'supertest'
import express from 'express'
import app from '../src/app'

import { Prisma, PrismaClient, TaskStatus } from '@prisma/client'

// Mock prisma so I don't need to hit the database
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        task: {
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findUnique: jest.fn(),
        },
        $disconnect: jest.fn(),
    }

    // For mocking prisma 404 error
    class PrismaClientKnownRequestError extends Error {
        code: string
        constructor(message: string, code: string) {
            super(message)
            this.code = code; // P2025 is 404
            this.name = 'PrismaClientKnownRequestError'
        }
    }

    return { 
        PrismaClient: jest.fn(() => mockPrisma), 
        TaskStatus: { PENDING: 'PENDING', PROGRESS: 'PROGRESS', DONE: 'DONE' },
        Prisma: { PrismaClientKnownRequestError }
    }
})

const prisma = new PrismaClient() as unknown as {
    task: {
        findMany: jest.Mock
        findUnique: jest.Mock
        create: jest.Mock
        update: jest.Mock
        delete: jest.Mock
    }
    $disconnect: jest.Mock
}

describe('Get tasks', () => {
    it('should return all tasks', async () => {
        const mockTasks = [
            { id: 1, title: 'wake up', description: 'wake up in the morning', dueDate: Date.now()},
            { id: 2, title: 'brush teeth', status: TaskStatus.PROGRESS}
        ]
        prisma.task.findMany.mockResolvedValue(mockTasks)

        const response = await request(app).get('/task')

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({tasks: mockTasks})
    })

    it('should return single task', async () => {
        const mockTasks = [
            { id: 1, title: 'wake up', description: 'wake up in the morning', dueDate: Date.now()},
            { id: 2, title: 'brush teeth', status: TaskStatus.PROGRESS}
        ]
        prisma.task.findUnique.mockResolvedValue(mockTasks[0])

        const response = await request(app).get('/task/1')

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(mockTasks[0])
    })

    it('should return 404 if single task not found', async () => {
        prisma.task.findUnique.mockResolvedValue(null)

        const response = await request(app).get('/task/3')

        expect(response.statusCode).toBe(404)
    })
})


describe('Create tasks', () => {
    it('should create single task', async () => {
        const postData = {title: 'wake up', description: 'wake up in the morning', dueDate: "2025-12-01"}
        const createTask = { id: 1, ...postData}

        prisma.task.create.mockResolvedValue(createTask)

        const response = await request(app).post('/task').send(postData)

        expect(response.statusCode).toBe(201)
        expect(response.body).toEqual(createTask)
    })

    it('should error if missing required field', async () => {
        const postData = {description: 'wake up in the morning', dueDate: Date.now()}
        const response = await request(app).post('/task').send(postData)

        expect(response.statusCode).toBe(400)
    })

    it('should error for invalid field', async () => {
        const postData = {description: 'wake up in the morning', dueDate: "wibble"}
        const response = await request(app).post('/task').send(postData)

        expect(response.statusCode).toBe(400)
    })
})

describe('Update tasks', () => {
    it('should update single task', async () => {
        const task = {id:1, title: 'wake up', description: 'wake up in the morning', dueDate: Date.now()}
        const putData = {description: 'wake up in the morning'}
        const updatedTask = { ...task, ...putData }

        prisma.task.update.mockResolvedValue(updatedTask)

        const response = await request(app).put(`/task/1`).send(putData)

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(updatedTask)
    })

    it('should 404 if single task not found', async () => {
        const putData = {description: 'wake up in the morning'}

        // Mock the 404 error returned by prisma
        prisma.task.update.mockRejectedValue(
            new (Prisma.PrismaClientKnownRequestError as unknown as {
                new (message: string, code: string): Error;
            })('Record not found', 'P2025')
        )

        const response = await request(app).put(`/task/2`).send(putData)

        expect(response.statusCode).toBe(404)
    })

    it('should error for invalid field', async () => {
        const putData = {description: 'wake up in the morning', dueDate: "wibble"}
        const response = await request(app).put('/task/1').send(putData)

        expect(response.statusCode).toBe(400)
    })
})


describe('Delete tasks', () => {
    it('should delete single task', async () => {
        const task = {id:1, title: 'wake up', description: 'wake up in the morning', dueDate: Date.now()}

        prisma.task.delete.mockResolvedValue(task)

        const response = await request(app).delete(`/task/1`)

        expect(response.statusCode).toBe(200)
    })

    it('should 404 if single task not found', async () => {
        prisma.task.delete.mockRejectedValue(
            new (Prisma.PrismaClientKnownRequestError as unknown as {
                new (message: string, code: string): Error;
            })('Record not found', 'P2025')
        );

        const response = await request(app).delete(`/task/2`)

        expect(response.statusCode).toBe(404)
    })
})

afterAll(async () => {
    await prisma.$disconnect();
});