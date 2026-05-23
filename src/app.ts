import express, { json, type Application } from 'express'
import { userRoutes } from './Modules/User/user.routes';
import { issuesRoutes } from './Modules/Issues/Issues.routes';
import cors from 'cors'
import config from './config';
import { globalErrorHandler } from './middleware/globalError';

const app: Application = express()
// export const port = config.port;
const allowedOrigins = [
  "https://dev-pluse-six.vercel.app",
  `http://localhost:${config.port}`,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());
app.use("/api/auth", userRoutes)
app.use("/api/issues", issuesRoutes)
app.use(globalErrorHandler);

app.get('/', (req, res) => {
  res.send('DevPulse Server')
})

export default app;