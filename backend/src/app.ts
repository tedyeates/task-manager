import express, { Express, Request, Response } from 'express'
import { TaskStatus } from '@prisma/client'
import prisma from "./prisma";
import { isValidDate, isValidStatus } from './utils';
import cors from 'cors'


const app: Express = express()

app.use(cors({
  origin: 'http://localhost:5173', // React's URL
  methods: ['GET','POST','PUT','DELETE'], // Allowed HTTP methods
  credentials: true // if you need cookies/auth
}))
app.use(express.json())

app.get('/task', async (req: Request, res: Response) => {
    try {
        const tasks = await prisma.task.findMany()
        res.json({ tasks })
    } catch (error: any) {
        res.status(500).json({ error: 'Server error' })
    }
})

app.get('/task/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const task = await prisma.task.findUnique({
            where: {
                id: Number(id)
            }
        })

        if (!task) {
            return res.status(404).json({ error: 'Task not found' })
        }

        res.json(task)
    } catch (error: any) {
        res.status(500).json({ error: 'Server error' })
    }
})

app.post('/task', async (req: Request, res: Response) => {
    const title = req.body?.title
    const description = req.body?.description
    const dueDate = req.body?.dueDate
    const status = req.body?.status


    if (!title) {
        return res.status(400).json({ error: 'Title is required' })
    }

    if (dueDate && !isValidDate(dueDate)) {
        return res.status(400).json({ error: "Invalid date format" })
    }

    if (status && isValidStatus(status)) {
        return res.status(400).json({ error: 'Invalid status format' })
    }


    try {
        const task = await prisma.task.create({
            data: {
                title, description,
                dueDate: new Date(dueDate),
                status: status || TaskStatus.PENDING
            }
        })

        res.status(201).json(task)
    } catch {
        res.status(500).json({ error: 'Server error' })
    }
})

app.put('/task/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const { title, description, dueDate, status } = req.body

    const updateDate = dueDate ? new Date(dueDate) : undefined
    if (dueDate && !isValidDate(dueDate)) {
        return res.status(400).json({ error: "Invalid date format" })
    }

    if (status && !isValidStatus(status)) {
        return res.status(400).json({ error: 'Invalid status format' })
    }


    try {
        const task = await prisma.task.update({
            where: {
                id: Number(id)
            },
            data: {
                title, description,
                dueDate: updateDate,
                status: status
            }
        })

        res.json(task)
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Task not found' })
        } else {
            res.status(500).json({ error: 'Server error' })
        }
    }
})

app.delete('/task/:id', async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const task = await prisma.task.delete({ 
            where: { 
                id: Number(id) 
            } 
        })

        res.json(task)
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Task not found' })
        } else {
            res.status(500).json({ error: 'Server error' })
        }
    }
})

export default app
