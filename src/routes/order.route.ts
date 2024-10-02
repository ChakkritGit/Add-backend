import { Router } from "express"
import { verifyToken } from "../middlewares"
import { cancelOrder, clearOrder, dispenseOrder, getOrder, receiveOrder, updateOrderList } from "../controllers"

const orderRouter: Router = Router()

orderRouter.get('/', verifyToken, getOrder)
orderRouter.get('/dispense/:rfid', verifyToken, dispenseOrder)
orderRouter.get('/receive/:sticker', verifyToken, receiveOrder)
orderRouter.post('/:prescriptionId', verifyToken, cancelOrder)
orderRouter.patch('/list/:order_id', updateOrderList)
orderRouter.get('/clear', clearOrder)

export default orderRouter