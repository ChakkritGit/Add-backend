import { Router } from "express"
import { verifyToken } from "../middlewares"
import { cancelOrder, dispenseOrder, getOrder, receiveOrder, updateOrderList } from "../controllers"

const orderRouter: Router = Router()

orderRouter.get('/:id', verifyToken, getOrder)
orderRouter.get('/dispense/:rfid/:uid', verifyToken, dispenseOrder)
orderRouter.get('/receive/:sticker', verifyToken, receiveOrder)
orderRouter.post('/:prescriptionId', verifyToken, cancelOrder)
orderRouter.patch('/list/:order_id', updateOrderList)

export default orderRouter