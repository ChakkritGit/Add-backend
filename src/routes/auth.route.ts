import { Router } from "express"
import { upload } from "../middlewares/uploadfile"
import { checkLogin, createUser } from "../controllers/auth.controller"
import { verifyToken } from "../middlewares"

const authRouter: Router = Router()

authRouter.post('/login', checkLogin)
authRouter.post('/register', upload.single('fileupload'), verifyToken, createUser)

export default authRouter