import { Router } from "express"
import { deleteUser, editeUser, getUser, getUserById } from "../controllers"
import { verifyToken } from "../middlewares"
import { upload } from "../middlewares/uploadfile"

const userRouter: Router = Router()

userRouter.get('/', verifyToken, getUser)
userRouter.get('/:id', verifyToken, getUserById)
userRouter.put('/:id', verifyToken, upload.single('fileupload'), editeUser)
userRouter.delete('/:id', verifyToken, deleteUser)

export default userRouter