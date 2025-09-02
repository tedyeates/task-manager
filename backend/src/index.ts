import express, { Express, Request, Response } from 'express'

const app: Express = express()
const port = 3000

app.get('/task', (req: Request, res: Response) => {
    
})

app.get('/task/:id', (req: Request, res: Response) => {
    const { id } = req.params
})

app.post('/task', (req: Request, res: Response) => {
    
})

app.put('/task/:id', (req: Request, res: Response) => {
    const { id } = req.params
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});