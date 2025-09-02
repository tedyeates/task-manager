import request from 'supertest'
import express from 'express'
import app from '../src/app'

import { PrismaClient, TaskStatus } from '@prisma/client'


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
    };
    return { PrismaClient: jest.fn(() => mockPrisma), TaskStatus: { PENDING: 'PENDING', PROGRESS: 'PROGRESS', DONE: 'DONE' } };
});

const prisma = new PrismaClient() as unknown as {
    task: {
        findMany: jest.Mock
        findUnique: jest.Mock
        create: jest.Mock
        update: jest.Mock
        delete: jest.Mock
    }
    $disconnect: jest.Mock
};

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
        const postData = {title: 'wake up', description: 'wake up in the morning', dueDate: Date.now()}
        const createTask = { id: 1, ...postData}

        prisma.task.create.mockResolvedValue(createTask)

        const response = await request(app).post('/task').send(postData)

        expect(response.statusCode).toBe(201)
        expect(response.statusCode).toEqual(createTask)
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

        prisma.task.update.mockResolvedValue(null)

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
        prisma.task.delete.mockResolvedValue(null)

        const response = await request(app).delete(`/task/2`)

        expect(response.statusCode).toBe(404)
    })
})

afterAll(async () => {
    await prisma.$disconnect();
});