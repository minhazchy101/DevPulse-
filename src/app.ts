import express, { type Application } from 'express'
const app: Application = express()
export const port = 3000

app.get('/', (req, res) => {
  res.send('DevPulse Server')
})

export default app;