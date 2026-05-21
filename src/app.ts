import express, { json, type Application } from 'express'
import { userRoutes } from './Modules/User/user.routes';
import { issuesRoutes } from './Modules/Issues/Issues.routes';

const app: Application = express()
// export const port = config.port;

app.use(express.json());
app.use("/api/auth", userRoutes)
app.use("/api/issues", issuesRoutes)

app.get('/', (req, res) => {
  res.send('DevPulse Server')
})

export default app;