import express, { Application } from "express"
import morgan from "morgan"
import cors from "cors"
import dotenv from "dotenv"
import routes from "./routes"
import { globalErrorHanlder } from "./middlewares/error.handle"
import { initRabbitMq } from "./services"
import { initSocket } from "./configs"
import http, { createServer } from "http"

const app: Application = express()

dotenv.config()
const port: number = parseInt(process.env.PORT as string, 10) || 8080
const server: http.Server = createServer(app);
//middleware
app.use(express.json())
app.use(cors({ origin: '*' }))
app.use(morgan("dev"))

// route
app.use("/api", routes)
app.use(globalErrorHanlder)

app.listen(port, async () => {
  initRabbitMq()
  initSocket(server)
  console.log(`Start server in port ${port} --mode ${process.env.NODE_ENV}`)
})