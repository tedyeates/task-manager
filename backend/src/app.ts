import express, { Express, Request, Response } from 'express'
import { TaskStatus } from '@prisma/client'
import prisma from "./prisma";

const app: Express = express()

app.use(express.json())

app.get('/task', (req: Request, res: Response) => {
    const tasks = prisma.task.findMany()
    res.json(tasks)
})

app.get('/task/:id', (req: Request, res: Response) => {
    const { id } = req.params
})

app.post('/task', (req: Request, res: Response) => {
    
})

app.put('/task/:id', (req: Request, res: Response) => {
    const { id } = req.params
})

app.delete('/task/:id', (req: Request, res: Response) => {
    const { id } = req.params
})

export default app
