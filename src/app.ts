import express, { json, type Application } from 'express'
import { userRoutes } from './Modules/User/user.routes';

const app: Application = express()
// export const port = config.port;

app.use(express.json());
app.use("/api/auth", userRoutes)

app.get('/', (req, res) => {
  res.send('DevPulse Server')
})

export default app;