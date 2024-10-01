import express, { Application } from "express"
import morgan from "morgan"
import cors from "cors"
import dotenv from "dotenv"
import routes from "./routes"
import { globalErrorHanlder } from "./middlewares/error.handle"
import { initRabbitMq } from "./services"
import { initSocket } from "./configs"
import http, { createServer } from "http"
import { morganDate} from "./constants"

dotenv.config()

const app: Application = express()
const server: http.Server = createServer(app)
const port: number = parseInt(process.env.PORT as string, 10) || 8080

//middleware
// app.use(morganMessage)
app.use(express.json())
app.use(cors({ origin: '*' }))
app.use(morgan(':date, :method :url :status'))

// morgan.token('message', serverResponse)
morgan.token('date', morganDate)

// route
app.use("/api", routes)
app.use(globalErrorHanlder)

server.listen(port, async () => {
  initRabbitMq()
  initSocket(server)
  console.log(`Start server in port ${port} --mode ${process.env.NODE_ENV}`)
})